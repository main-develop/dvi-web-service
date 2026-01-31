"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "motion/react";

type AnimationPhase = "hidden" | "matrix" | "revealed";

interface LetterState {
  char: string;
  phase: AnimationPhase;
  isSpace: boolean;
}

interface MatrixTextProps {
  phrases?: string[];
  className?: string;
  initialDelay?: number;
  letterRevealDelay?: number;
  letterInterval?: number;
  phraseDuration?: number;
}

export const MatrixText = ({
  phrases = ["Default text"],
  className,
  initialDelay = 200,
  letterRevealDelay = 300,
  letterInterval = 60,
  phraseDuration = 3500,
}: MatrixTextProps) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const currentPhrase = phrases[currentPhraseIndex];
  const phraseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Find the longest phrase to use as the base width
  const longestPhrase = useMemo(
    () => phrases.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [phrases],
  );

  // Initialize all letters as hidden
  const [letters, setLetters] = useState<LetterState[]>(() =>
    currentPhrase.split("").map((char) => ({
      char,
      phase: "hidden",
      isSpace: char === " ",
    })),
  );

  const getRandomChar = useCallback(
    () => (Math.random() > 0.5 ? "1" : "0"),
    [],
  );

  // Clear all pending animation timeouts
  const clearAnimationTimeouts = useCallback(() => {
    animationTimeoutsRef.current.forEach(clearTimeout);
    animationTimeoutsRef.current = [];
  }, []);

  // Animate letters appearing: hidden -> matrix -> revealed
  const animateIn = useCallback(
    (targetPhrase: string, onComplete?: () => void) => {
      clearAnimationTimeouts();

      // Initialize letters as hidden
      setLetters(
        targetPhrase.split("").map((char) => ({
          char,
          phase: "hidden",
          isSpace: char === " ",
        })),
      );

      // Animate each letter one by one
      targetPhrase.split("").forEach((char, index) => {
        const isSpace = char === " ";

        // Show matrix character (0 or 1)
        const showMatrixTimeout = setTimeout(() => {
          setLetters((prev) => {
            const newLetters = [...prev];
            newLetters[index] = {
              char: isSpace ? " " : getRandomChar(),
              phase: isSpace ? "revealed" : "matrix",
              isSpace,
            };
            return newLetters;
          });
        }, index * letterInterval);

        animationTimeoutsRef.current.push(showMatrixTimeout);

        // Reveal actual character
        if (!isSpace) {
          const revealTimeout = setTimeout(
            () => {
              setLetters((prev) => {
                const newLetters = [...prev];
                newLetters[index] = {
                  char: targetPhrase[index],
                  phase: "revealed",
                  isSpace: false,
                };
                return newLetters;
              });

              // Call onComplete after last letter is revealed
              if (index === targetPhrase.length - 1 && onComplete) {
                onComplete();
              }
            },
            index * letterInterval + letterRevealDelay,
          );

          animationTimeoutsRef.current.push(revealTimeout);
        } else if (index === targetPhrase.length - 1 && onComplete) {
          const completeTimeout = setTimeout(
            onComplete,
            index * letterInterval,
          );
          animationTimeoutsRef.current.push(completeTimeout);
        }
      });
    },
    [getRandomChar, letterInterval, letterRevealDelay, clearAnimationTimeouts],
  );

  // Animate letters transitioning: revealed -> matrix -> new revealed
  const animateTransition = useCallback(
    (fromPhrase: string, toPhrase: string, onComplete?: () => void) => {
      clearAnimationTimeouts();

      const maxLength = Math.max(fromPhrase.length, toPhrase.length);

      // Pad phrases to equal length for animation
      const paddedFrom = fromPhrase.padEnd(maxLength, " ");
      const paddedTo = toPhrase.padEnd(maxLength, " ");

      // Start with current revealed state
      setLetters(
        paddedFrom.split("").map((char) => ({
          char,
          phase: "revealed",
          isSpace: char === " ",
        })),
      );

      // Animate each letter position
      for (let index = 0; index < maxLength; index++) {
        const fromChar = paddedFrom[index];
        const toChar = paddedTo[index];
        const isToSpace = toChar === " ";

        // If characters are the same, skip animation for this position
        if (fromChar === toChar) {
          continue;
        }

        // Change to matrix (0 or 1)
        const toMatrixTimeout = setTimeout(() => {
          setLetters((prev) => {
            const newLetters = [...prev];
            if (index < newLetters.length) {
              newLetters[index] = {
                char: isToSpace ? " " : getRandomChar(),
                phase: isToSpace ? "hidden" : "matrix",
                isSpace: isToSpace,
              };
            } else {
              // Add new letter if needed
              newLetters.push({
                char: getRandomChar(),
                phase: "matrix",
                isSpace: false,
              });
            }
            return newLetters;
          });
        }, index * letterInterval);

        animationTimeoutsRef.current.push(toMatrixTimeout);

        // Reveal new character
        const revealTimeout = setTimeout(
          () => {
            setLetters((prev) => {
              const newLetters = [...prev];
              if (index < newLetters.length) {
                newLetters[index] = {
                  char: toChar,
                  phase: isToSpace ? "hidden" : "revealed",
                  isSpace: isToSpace,
                };
              }
              // Trim array to target phrase length after last letter
              if (index === maxLength - 1) {
                return newLetters.slice(0, toPhrase.length);
              }
              return newLetters;
            });
          },
          index * letterInterval + letterRevealDelay,
        );

        animationTimeoutsRef.current.push(revealTimeout);
      }

      // Call onComplete after all animations finish
      if (onComplete) {
        const completeTimeout = setTimeout(
          onComplete,
          maxLength * letterInterval + letterRevealDelay + 50,
        );
        animationTimeoutsRef.current.push(completeTimeout);
      }
    },
    [getRandomChar, letterInterval, letterRevealDelay, clearAnimationTimeouts],
  );

  // Initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      animateIn(currentPhrase, () => {
        // Start phrase cycling after initial animation completes
        if (phrases.length > 1) {
          phraseTimerRef.current = setTimeout(() => {
            setCurrentPhraseIndex(1);
          }, phraseDuration);
        }
      });
    }, initialDelay);

    return () => {
      clearTimeout(timer);
      clearAnimationTimeouts();
      if (phraseTimerRef.current) clearTimeout(phraseTimerRef.current);
    };
  }, []);

  // Handle phrase transitions
  const prevPhraseIndexRef = useRef(0);
  useEffect(() => {
    if (currentPhraseIndex === 0 && prevPhraseIndexRef.current === 0) {
      return; // Skip initial render
    }

    const prevPhrase = phrases[prevPhraseIndexRef.current];
    prevPhraseIndexRef.current = currentPhraseIndex;

    animateTransition(prevPhrase, currentPhrase, () => {
      // Schedule next phrase change
      if (phrases.length > 1) {
        phraseTimerRef.current = setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, phraseDuration);
      }
    });

    return () => {
      if (phraseTimerRef.current) clearTimeout(phraseTimerRef.current);
    };
  }, [currentPhraseIndex]);

  const motionVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      matrix: {
        opacity: 1,
        color: "var(--color-matrix)",
        textShadow: "0 0 8px var(--color-matrix-80)",
      },
      revealed: { opacity: 1 },
    }),
    [],
  );

  return (
    <div className={className}>
      <div className="relative">
        {/* Invisible longest phrase for consistent width */}
        <span className="invisible whitespace-pre">{longestPhrase}</span>
        {/* Actual animated content */}
        <div className="absolute inset-0">
          {letters.map((letter, index) => {
            return letter.isSpace ? (
              <span key={index} className="inline-block w-[0.3em]" />
            ) : (
              <span
                key={index}
                className="relative inline-block align-top"
                style={{ lineHeight: 1 }}
              >
                {/* Animated character positioned on top, centered */}
                <motion.span
                  className="flex items-center justify-center"
                  initial="hidden"
                  animate={letter.phase}
                  variants={motionVariants}
                  transition={{
                    duration: 0.1,
                    ease: "easeOut",
                  }}
                >
                  {letter.char}
                </motion.span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
