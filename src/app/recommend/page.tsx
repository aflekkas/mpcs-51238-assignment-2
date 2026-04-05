"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { useWatchlist } from "@/lib/watchlist-context";
import { PosterCard } from "@/components/poster-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Clapperboard,
  Shuffle,
  Sparkles,
  Brain,
  BarChart3,
  Search,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SparklesText } from "@/components/ui/sparkles-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { PageContainer } from "@/components/page-container";
import { MediaMetadata } from "@/components/media-metadata";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { WatchItem } from "@/lib/types";

const ANALYSIS_STEPS = [
  { icon: Brain, text: "Analyzing your watch history...", duration: 1200 },
  { icon: BarChart3, text: "Scoring genre preferences...", duration: 1000 },
  { icon: Search, text: "Scanning your queue...", duration: 900 },
  { icon: Sparkles, text: "Computing match scores...", duration: 800 },
  { icon: CheckCircle, text: "Found your perfect pick!", duration: 600 },
];

function getGenreScores(items: WatchItem[]) {
  const scores: Record<string, { total: number; count: number }> = {};
  for (const item of items) {
    if (
      (item.status === "completed" || item.status === "watching") &&
      item.rating
    ) {
      if (!scores[item.genre]) scores[item.genre] = { total: 0, count: 0 };
      scores[item.genre].total += item.rating;
      scores[item.genre].count += 1;
    }
  }
  const result: Record<string, number> = {};
  for (const [genre, data] of Object.entries(scores)) {
    result[genre] = data.total / data.count;
  }
  return result;
}

function getTopGenres(items: WatchItem[]) {
  const scores = getGenreScores(items);
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([genre, score]) => ({ genre, score }));
}

function scoreCandidates(items: WatchItem[], candidates: WatchItem[]) {
  const genreScores = getGenreScores(items);
  const favoriteGenres = new Set(
    items.filter((i) => i.favorite).map((i) => i.genre)
  );

  return candidates
    .map((item) => {
      let score = 0;
      if (genreScores[item.genre]) {
        score += genreScores[item.genre] * 20;
      }
      if (favoriteGenres.has(item.genre)) {
        score += 15;
      }
      if (item.favorite) {
        score += 10;
      }
      return { item, score, matchPct: Math.min(99, Math.round(score)) };
    })
    .sort((a, b) => b.score - a.score);
}

function getMatchReason(item: WatchItem, items: WatchItem[]) {
  const matchedFavorites = items.filter(
    (i) =>
      i.genre === item.genre &&
      i.favorite &&
      (i.status === "completed" || i.status === "watching")
  );
  const highRated = items.filter(
    (i) =>
      i.genre === item.genre &&
      i.rating &&
      i.rating >= 4 &&
      (i.status === "completed" || i.status === "watching")
  );

  if (matchedFavorites.length > 0) {
    const titles = matchedFavorites.slice(0, 2).map((i) => i.title);
    return `You loved ${titles.join(" and ")}`;
  }
  if (highRated.length > 0) {
    return `You rated ${item.genre} titles highly`;
  }
  return `Matches your taste in ${item.genre}`;
}

export default function RecommendPage() {
  const { items } = useWatchlist();
  const candidates = useMemo(
    () => items.filter((i) => i.status === "plan-to-watch"),
    [items]
  );
  const scoredCandidates = useMemo(
    () => scoreCandidates(items, candidates),
    [items, candidates]
  );
  const topGenres = useMemo(() => getTopGenres(items), [items]);

  const [spotlightItem, setSpotlightItem] = useState<WatchItem | null>(null);
  const [spotlightReason, setSpotlightReason] = useState("");
  const [spotlightMatch, setSpotlightMatch] = useState(0);
  const [spotlightKey, setSpotlightKey] = useState(0);

  const [isShuffling, setIsShuffling] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const confettiRef = useRef<ConfettiRef>(null);

  const handleShuffle = useCallback(() => {
    if (candidates.length === 0 || isShuffling || isAnalyzing) return;
    setIsShuffling(true);
    setAnalysisComplete(false);

    let count = 0;
    const totalCycles = 8 + Math.floor(Math.random() * 5);
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * candidates.length);
      setSpotlightItem(candidates[idx]);
      setSpotlightReason("");
      setSpotlightMatch(0);
      count++;
      if (count >= totalCycles) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * candidates.length);
        const pick = candidates[finalIdx];
        setSpotlightItem(pick);
        setSpotlightReason("Random pick from your queue");
        setSpotlightMatch(0);
        setSpotlightKey((k) => k + 1);
        setIsShuffling(false);
        confettiRef.current?.fire({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 100);
  }, [candidates, isShuffling, isAnalyzing]);

  const handleRecommend = useCallback(() => {
    if (scoredCandidates.length === 0 || isShuffling || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setSpotlightItem(null);
    setSpotlightReason("");
    setAnalysisStep(0);

    let step = 0;
    const runStep = () => {
      if (step >= ANALYSIS_STEPS.length) {
        const pick = scoredCandidates[0];
        setSpotlightItem(pick.item);
        setSpotlightReason(getMatchReason(pick.item, items));
        setSpotlightMatch(pick.matchPct);
        setSpotlightKey((k) => k + 1);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        confettiRef.current?.fire({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        return;
      }
      setAnalysisStep(step);
      step++;
      setTimeout(runStep, ANALYSIS_STEPS[step - 1].duration);
    };
    runStep();
  }, [scoredCandidates, items, isShuffling, isAnalyzing]);

  if (candidates.length === 0) {
    return (
      <PageContainer>
        <BlurFade delay={0.1}>
          <EmptyState
            icon={Clapperboard}
            title="Nothing to Recommend"
            description="Add some titles to your Plan to Watch list, then come back for a pick."
          >
            <Button
              nativeButton={false}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              render={<Link href="/" />}
            >
              Browse Watchlist
            </Button>
          </EmptyState>
        </BlurFade>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed inset-0 z-[200] h-full w-full"
      />

      <div className="flex flex-col gap-8">
        {/* Header */}
        <BlurFade delay={0.05}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <SparklesText
                className="text-3xl font-bold text-white"
                colors={{ first: "#E50914", second: "#FF6B6B" }}
                sparklesCount={6}
              >
                What Should I Watch?
              </SparklesText>
              <p className="text-muted-foreground mt-1">
                {candidates.length} title
                {candidates.length !== 1 ? "s" : ""} in your queue. Let us help
                you decide.
              </p>
            </div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleShuffle}
                  disabled={isShuffling || isAnalyzing}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 gap-2"
                >
                  <motion.div
                    animate={isShuffling ? { rotate: 360 } : {}}
                    transition={
                      isShuffling
                        ? {
                            duration: 0.5,
                            repeat: Infinity,
                            ease: "linear",
                          }
                        : {}
                    }
                  >
                    <Shuffle className="h-4 w-4" />
                  </motion.div>
                  {isShuffling ? "Shuffling..." : "Feeling Lucky"}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleRecommend}
                  disabled={isShuffling || isAnalyzing}
                  className="bg-netflix-red hover:bg-netflix-red/80 text-white font-semibold gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isAnalyzing ? "Analyzing..." : "Recommend"}
                </Button>
              </motion.div>
            </div>
          </div>
        </BlurFade>

        {/* Algorithm Analysis Steps */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
                <div className="flex flex-col gap-3">
                  {ANALYSIS_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i === analysisStep;
                    const isDone = i < analysisStep;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: isDone || isActive ? 1 : 0.3,
                          x: 0,
                        }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className={cn(
                          "flex items-center gap-3 text-sm transition-colors",
                          isActive && "text-netflix-red",
                          isDone && "text-green-400",
                          !isActive && !isDone && "text-white/30"
                        )}
                      >
                        <div className="relative">
                          <Icon className="h-4 w-4" />
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-netflix-red/20"
                              animate={{
                                scale: [1, 1.8, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          )}
                        </div>
                        <span
                          className={cn(
                            "font-medium",
                            isActive && "text-white"
                          )}
                        >
                          {step.text}
                        </span>
                        {isDone && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-green-400 text-xs ml-auto"
                          >
                            Done
                          </motion.span>
                        )}
                        {isActive && (
                          <motion.div className="ml-auto h-1 w-16 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              className="h-full bg-netflix-red rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: step.duration / 1000,
                                ease: "easeInOut",
                              }}
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Genre insights during analysis */}
                {analysisStep >= 1 && topGenres.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <p className="text-xs text-muted-foreground mb-2">
                      Your top genres
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {topGenres.slice(0, 5).map(({ genre, score }, i) => (
                        <motion.span
                          key={genre}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white"
                        >
                          {genre}
                          <span className="text-netflix-red font-semibold">
                            {score.toFixed(1)}
                          </span>
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spotlight Result */}
        <AnimatePresence mode="wait">
          {spotlightItem && !isAnalyzing && (
            <motion.div
              key={spotlightKey}
              className="relative rounded-lg overflow-hidden p-6 sm:p-8"
              initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ transformPerspective: 1000 }}
            >
              <div
                className="absolute inset-0 opacity-30 blur-xl"
                style={{ background: spotlightItem.posterGradient }}
              />
              <div className="absolute inset-0 bg-background/60" />
              <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center w-full">
                <motion.div
                  className="shrink-0"
                  initial={{ opacity: 0, x: -30, rotateY: -20 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{
                    delay: 0.15,
                    type: "spring",
                    stiffness: 150,
                  }}
                >
                  <PosterCard item={spotlightItem} size="lg" />
                </motion.div>
                <motion.div
                  className="flex flex-col gap-2 text-center sm:text-left"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  <motion.div
                    className="flex items-center gap-2 justify-center sm:justify-start"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <p className="text-xs uppercase tracking-widest text-netflix-red font-semibold">
                      {analysisComplete
                        ? "Top recommendation"
                        : "Tonight's pick"}
                    </p>
                    {spotlightMatch > 0 && (
                      <span className="text-xs bg-netflix-red/20 text-netflix-red px-2 py-0.5 rounded-full font-semibold">
                        {spotlightMatch}% match
                      </span>
                    )}
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {spotlightItem.title}
                  </h2>
                  <MediaMetadata
                    item={spotlightItem}
                    className="text-sm text-muted-foreground"
                  />
                  {spotlightReason && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-white/70 mt-1 flex items-center gap-1.5 justify-center sm:justify-start"
                    >
                      <Sparkles className="h-3 w-3 text-netflix-red" />
                      {spotlightReason}
                    </motion.p>
                  )}
                  {spotlightItem.review && (
                    <p className="text-sm text-white/50 mt-2 max-w-lg italic">
                      &ldquo;{spotlightItem.review}&rdquo;
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ranked Queue */}
        <div>
          <BlurFade delay={0.2}>
            <h2 className="text-lg font-semibold text-white mb-4">
              Your Queue (
              <NumberTicker
                value={candidates.length}
                className="text-white"
              />
              )
            </h2>
          </BlurFade>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
            {scoredCandidates.map(({ item, matchPct }, i) => (
              <BlurFade key={item.id} delay={0.1 + i * 0.05} offset={16}>
                <PosterCard item={item} className="w-full" matchPct={matchPct} />
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
