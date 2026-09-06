"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { proyectosReales } from "../data/onilabs";
import ProjectVisual from "./ProjectVisual";

export default function Portfolio() {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const directionLocked = useRef(null);
  const currentX = useRef(0);
  const dragStartX = useRef(0);
  const animationRef = useRef(null);
  const speedRef = useRef(1);

  const DRAG_THRESHOLD = 5;
  const DIRECTION_LOCK_THRESHOLD = 8;

  // Duplicate for seamless loop
  const proyectosLoop = [...proyectosReales, ...proyectosReales, ...proyectosReales];

  const setTranslate = useCallback((x) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${x}px)`;
    }
  }, []);

  const getSegmentWidth = useCallback(() => {
    if (!trackRef.current) return 0;
    return trackRef.current.scrollWidth / 3;
  }, []);

  const wrapPosition = useCallback(() => {
    const seg = getSegmentWidth();
    if (seg === 0) return;
    // Keep position within the middle segment
    if (currentX.current < -seg * 2) currentX.current += seg;
    if (currentX.current > -seg) currentX.current -= seg;
  }, [getSegmentWidth]);

  const autoScroll = useCallback(() => {
    if (isDragging.current) {
      animationRef.current = requestAnimationFrame(autoScroll);
      return;
    }
    currentX.current -= speedRef.current;
    wrapPosition();
    setTranslate(currentX.current);
    animationRef.current = requestAnimationFrame(autoScroll);
  }, [wrapPosition, setTranslate]);

  const startAutoScroll = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(autoScroll);
  }, [autoScroll]);

  // --- Mouse handlers (desktop) ---
  const handleMouseDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    dragStartX.current = currentX.current;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > DRAG_THRESHOLD) hasDragged.current = true;
    currentX.current = dragStartX.current + dx;
    wrapPosition();
    setTranslate(currentX.current);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    if (isDragging.current) isDragging.current = false;
  };

  // --- Touch handlers (mobile) ---
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    isDragging.current = true;
    hasDragged.current = false;
    directionLocked.current = null;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    dragStartX.current = currentX.current;
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;

    if (directionLocked.current === null) {
      if (Math.abs(dx) < DIRECTION_LOCK_THRESHOLD && Math.abs(dy) < DIRECTION_LOCK_THRESHOLD) return;
      directionLocked.current = Math.abs(dx) >= Math.abs(dy) ? "horizontal" : "vertical";
    }

    if (directionLocked.current === "vertical") {
      isDragging.current = false;
      return;
    }

    e.preventDefault();
    if (Math.abs(dx) > DRAG_THRESHOLD) hasDragged.current = true;
    currentX.current = dragStartX.current + dx;
    wrapPosition();
    setTranslate(currentX.current);
  }, [wrapPosition, setTranslate]);

  const handleTouchEnd = () => {
    isDragging.current = false;
    directionLocked.current = null;
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) speedRef.current = 0;

    // Start from middle segment
    const seg = getSegmentWidth();
    currentX.current = -seg;
    setTranslate(currentX.current);

    const track = trackRef.current;
    if (track) {
      track.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    startAutoScroll();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (track) {
        track.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [getSegmentWidth, setTranslate, handleTouchMove, startAutoScroll]);

  return (
    <section id="portafolio" className="relative bg-background py-16 sm:py-20">
      <div className="mx-auto">
        <div className="mb-12 text-center px-4">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Nuestro trabajo
          </p>
          <h2 className="mb-4 text-2xl sm:text-4xl md:text-5xl font-bold text-text-primary">
            Repositorio
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-text-secondary leading-relaxed">
            Proyectos reales que hemos desarrollado para nuestros clientes
          </p>
        </div>

        <div
          className="overflow-hidden py-6 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Carrusel de proyectos"
        >
          <div
            ref={trackRef}
            className="flex gap-6 sm:gap-8 will-change-transform"
            style={{ transform: "translateX(0px)" }}
          >
            {proyectosLoop.map((proyecto, index) => (
              <div
                key={index}
                className="w-[370px] sm:w-[449px] lg:w-[1030px] flex-shrink-0"
              >
                <div className="group rounded-2xl overflow-hidden border border-border bg-background transition-all duration-base ease-out-expo hover:border-primary/40 hover:shadow-xl hover:shadow-primary/8">
                  {/* Image with hover overlay */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <ProjectVisual
                      proyecto={proyecto}
                      sizes="(max-width: 768px) 80vw, 780px"
                      imageClassName="object-cover transition-transform duration-slow ease-out-expo group-hover:scale-[1.05]"
                      showOverlay={Boolean(proyecto.url && !proyecto.sinSoporte)}
                    />
                  </div>

                  {/* Info bar */}
                  <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between h-[72px] sm:h-[80px]">
                    <div className="min-w-0 flex-1">
                      {proyecto.url && !proyecto.sinSoporte ? (
                        <a
                          href={proyecto.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (hasDragged.current) e.preventDefault();
                          }}
                          className="link-underline inline-block text-base sm:text-xl font-semibold text-text-primary hover:text-primary transition-colors duration-fast ease-out-expo truncate max-w-full"
                        >
                          {proyecto.nombre}
                        </a>
                      ) : (
                        <span className="inline-block text-base sm:text-xl font-semibold text-text-primary truncate max-w-full">
                          {proyecto.nombre}
                        </span>
                      )}
                      <p className="mt-1 text-xs sm:text-sm text-text-secondary truncate">
                        {proyecto.descripcion}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0 items-center gap-3">
                      {proyecto.url && !proyecto.sinSoporte && (
                        <a
                          href={proyecto.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Abrir ${proyecto.nombre} en nueva pestaña`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (hasDragged.current) e.preventDefault();
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 focus-visible:text-primary focus-visible:bg-primary/10 transition-colors duration-fast ease-out-expo"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
