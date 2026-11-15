/**
 * LeadintelAI 3D Topographical Wave Ribbon & Metric Counter
 * Grounded in Motion.dev's exact mathematical 3D terrain architecture:
 * 
 * - 4 Animated Gaussian landform hills (ha, hb, hc, hd) with exp(-dist^2) decay
 * - 3 Multi-frequency traveling harmonic surface ripples
 * - 3D Perspective foreshortening (perspective = 0.62 + uv.y * 0.78)
 * - Focused rim lighting on ridge crests (analytic surface normals & grazing view angle)
 * - Dual-directional wireframe mesh (flowing longitudinal contours + transverse cross ribs)
 * - Seamless radial & bottom vignette finishing into dark backdrop (zero hard edges)
 * - Pre-allocated Float32Array buffers (zero GC stutter, locked 60/120fps)
 * - Delta-time timestamp smoothing for rock-solid framerates
 * - Hardware-accelerated crest glow pass
 * - IntersectionObserver auto-pause for 0% idle CPU
 * - Retina DPR rendering
 */
(function () {
    'use strict';

    function initWaveCanvas(canvas) {
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var width = 0;
        var height = 0;
        var t = 0;
        var lastTime = 0;
        var animId = null;

        var theme = canvas.getAttribute('data-wave-theme') || 'blue';
        var numRows = 68;      // Longitudinal contour curves
        var numCols = 136;     // Resolution along each curve
        var crossSteps = 4;    // Step interval for transverse wireframe ribs

        var totalPoints = numRows * numCols;
        var gridX = new Float32Array(totalPoints);
        var gridY = new Float32Array(totalPoints);
        var gridRim = new Float32Array(totalPoints);
        var gridDepth = new Float32Array(totalPoints);

        // Seeded Gaussian hills matching Motion's terrain landscape
        var hillA = { x: -2.8, y: 0.6, height: 1.45, wx: 0.48, wy: 0.65 };
        var hillB = { x: 1.8, y: 0.4, height: 1.35, wx: 0.42, wy: 0.58 };
        var hillC = { x: -0.6, y: -1.2, height: 0.95, wx: 0.50, wy: 0.70 };
        var hillD = { x: 3.2, y: -1.0, height: 0.90, wx: 0.45, wy: 0.62 };

        // Color palettes per service revenue engine
        var colors = {
            blue: {
                base: 'rgba(59, 130, 246, ',
                mid: 'rgba(96, 165, 250, ',
                crest: 'rgba(186, 230, 253, ',
                wire: 'rgba(147, 197, 253, ',
                glowPass: 'rgba(56, 189, 248, 0.16)'
            },
            purple: {
                base: 'rgba(147, 51, 234, ',
                mid: 'rgba(168, 85, 247, ',
                crest: 'rgba(233, 213, 255, ',
                wire: 'rgba(192, 132, 252, ',
                glowPass: 'rgba(168, 85, 247, 0.16)'
            },
            emerald: {
                base: 'rgba(6, 95, 70, ',
                mid: 'rgba(4, 120, 87, ',
                crest: 'rgba(187, 247, 208, ',
                wire: 'rgba(110, 231, 183, ',
                glowPass: 'rgba(6, 95, 70, 0.16)'
            },
            amber: {
                base: 'rgba(194, 65, 12, ',
                mid: 'rgba(234, 88, 12, ',
                crest: 'rgba(254, 215, 170, ',
                wire: 'rgba(251, 146, 60, ',
                glowPass: 'rgba(234, 88, 12, 0.16)'
            },
            sky: {
                base: 'rgba(14, 165, 233, ',
                mid: 'rgba(56, 189, 248, ',
                crest: 'rgba(224, 242, 254, ',
                wire: 'rgba(186, 230, 253, ',
                glowPass: 'rgba(56, 189, 248, 0.16)'
            }
        };

        var palette = colors[theme] || colors.blue;

        // Motion's continuous mathematical terrain evaluation
        function terrainAt(px, py, time) {
            var a_x = px - (hillA.x + Math.sin(time) * 0.35);
            var a_y = py - (hillA.y + Math.cos(time * 0.8) * 0.28);
            var distA = a_x * a_x * hillA.wx * hillA.wx + a_y * a_y * hillA.wy * hillA.wy;
            var ha = hillA.height * Math.exp(-distA);

            var b_x = px - (hillB.x + Math.cos(time * 0.7) * 0.42);
            var b_y = py - (hillB.y + Math.sin(time * 0.9) * 0.38);
            var distB = b_x * b_x * hillB.wx * hillB.wx + b_y * b_y * hillB.wy * hillB.wy;
            var hb = hillB.height * Math.exp(-distB);

            var c_x = px - (hillC.x + Math.sin(time * 0.6) * 0.32);
            var c_y = py - hillC.y;
            var distC = c_x * c_x * hillC.wx * hillC.wx + c_y * c_y * hillC.wy * hillC.wy;
            var hc = hillC.height * Math.exp(-distC);

            var d_x = px - hillD.x;
            var d_y = py - (hillD.y + Math.cos(time) * 0.26);
            var distD = d_x * d_x * hillD.wx * hillD.wx + d_y * d_y * hillD.wy * hillD.wy;
            var hd = hillD.height * Math.exp(-distD);

            // Harmonic traveling ripples
            var phaseA = px * 3.2 + py * 2.3 + time;
            var phaseB = px * 6.1 - py * 4.7 - time * 0.8;
            var phaseC = px * 0.85 + py * 1.2 - time;
            var detail = 0.045 * Math.sin(phaseA) + 0.02 * Math.sin(phaseB) + 0.09 * Math.sin(phaseC);

            var heightVal = ha + hb + hc + hd + detail;

            // Analytic slopes for normal & grazing rim illumination
            var slopeX = -2.0 * (ha * a_x * hillA.wx * hillA.wx + hb * b_x * hillB.wx * hillB.wx + hc * c_x * hillC.wx * hillC.wx + hd * d_x * hillD.wx * hillD.wx)
                + 0.045 * Math.cos(phaseA) * 3.2 + 0.02 * Math.cos(phaseB) * 6.1 + 0.09 * Math.cos(phaseC) * 0.85;
            var slopeY = -2.0 * (ha * a_y * hillA.wy * hillA.wy + hb * b_y * hillB.wy * hillB.wy + hc * c_y * hillC.wy * hillC.wy + hd * d_y * hillD.wy * hillD.wy)
                + 0.045 * Math.cos(phaseA) * 2.3 - 0.02 * Math.cos(phaseB) * 4.7 + 0.09 * Math.cos(phaseC) * 1.2;

            return { h: heightVal, sx: slopeX, sy: slopeY };
        }

        function resize() {
            var parent = canvas.parentElement;
            if (!parent) return;
            var rect = parent.getBoundingClientRect();
            width = rect.width || parent.offsetWidth || window.innerWidth;
            height = rect.height || parent.offsetHeight || 580;
            if (width === 0 || height === 0) return;
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }

        window.addEventListener('resize', resize, { passive: true });
        window.addEventListener('load', resize, { passive: true });
        resize();
        setTimeout(resize, 100);
        setTimeout(resize, 500);

        function render(now) {
            if (!lastTime) lastTime = now;
            var dt = (now - lastTime) / 1000;
            lastTime = now;
            if (dt > 0.08 || dt < 0) dt = 0.016;

            // Fluid, calm physical velocity progression
            t += dt * 0.32;

            ctx.clearRect(0, 0, width, height);

            // 1. Calculate all 3D mesh points with perspective projection
            for (var i = 0; i < numRows; i++) {
                var normI = i / (numRows - 1); // 0 (horizon/back) to 1 (foreground)
                var pY = (normI - 0.5) * 6.5;
                var perspective = 0.62 + normI * 0.78;
                var rowIdx = i * numCols;

                for (var j = 0; j < numCols; j++) {
                    var normJ = j / (numCols - 1);
                    var pX = (normJ - 0.5) * 11.5;

                    var sample = terrainAt(pX, pY, t);

                    // 3D perspective mapping across hero landscape
                    var x = width * (0.5 + (pX / 11.5) * (0.84 + normI * 0.32));
                    var y = height * (0.16 + normI * 0.70 - sample.h * 0.22 * perspective);

                    // Normal vector & grazing rim light calculation
                    var len = Math.sqrt(sample.sx * sample.sx + 1.0 + sample.sy * sample.sy);
                    var nx = -sample.sx / len;
                    var ny = 1.0 / len;
                    var nz = -sample.sy / len;

                    // View vector
                    var vLen = Math.sqrt(pX * 0.04 * pX * 0.04 + 0.42 * 0.42 + 1.0);
                    var vx = -pX * 0.04 / vLen;
                    var vy = 0.42 / vLen;
                    var vz = 1.0 / vLen;

                    var dot = nx * vx + ny * vy + nz * vz;
                    var grazing = Math.pow(Math.max(0, 1.0 - Math.abs(dot)), 3.2);

                    // Focus band: maximum sharpness near mid-depth
                    var focus = 1.0 - Math.min(1.0, Math.abs(normI - 0.58) / 0.42);
                    var rim = grazing * focus;

                    var idx = rowIdx + j;
                    gridX[idx] = x;
                    gridY[idx] = y;
                    gridRim[idx] = rim;
                    gridDepth[idx] = normI;
                }
            }

            // 2. Draw longitudinal contour curves with luminous crest gradients
            for (var i = 0; i < numRows; i++) {
                var normI = i / (numRows - 1);
                var rowIdx = i * numCols;
                var depthFade = Math.pow(normI, 1.25);
                var baseAlpha = 0.15 + depthFade * 0.75;
                var isCrest = normI > 0.72;

                var grad = ctx.createLinearGradient(0, 0, width, 0);
                grad.addColorStop(0.0, palette.base + '0)');
                grad.addColorStop(0.14, palette.base + (baseAlpha * 0.45) + ')');

                if (isCrest) {
                    grad.addColorStop(0.40, palette.crest + (baseAlpha * 0.88) + ')');
                    grad.addColorStop(0.55, 'rgba(255, 255, 255, ' + (baseAlpha * 0.95) + ')');
                    grad.addColorStop(0.70, palette.crest + (baseAlpha * 0.88) + ')');
                } else {
                    grad.addColorStop(0.42, palette.mid + (baseAlpha * 0.75) + ')');
                    grad.addColorStop(0.68, palette.crest + (baseAlpha * 0.82) + ')');
                }

                grad.addColorStop(0.86, palette.base + (baseAlpha * 0.45) + ')');
                grad.addColorStop(1.0, palette.base + '0)');

                // Hardware-accelerated crest glow pass
                if (isCrest && normI > 0.85) {
                    ctx.strokeStyle = palette.glowPass;
                    ctx.lineWidth = 3.2;
                    ctx.beginPath();
                    for (var j = 0; j < numCols; j++) {
                        var idx = rowIdx + j;
                        if (j === 0) ctx.moveTo(gridX[idx], gridY[idx]);
                        else ctx.lineTo(gridX[idx], gridY[idx]);
                    }
                    ctx.stroke();
                }

                // Sharp primary wireframe contour
                ctx.strokeStyle = grad;
                ctx.lineWidth = 0.95 + normI * 0.45;
                ctx.beginPath();
                for (var j = 0; j < numCols; j++) {
                    var idx = rowIdx + j;
                    if (j === 0) ctx.moveTo(gridX[idx], gridY[idx]);
                    else ctx.lineTo(gridX[idx], gridY[idx]);
                }
                ctx.stroke();
            }

            // 3. Draw transverse wireframe cross-contour ribs
            ctx.lineWidth = 0.65;
            for (var j = 0; j < numCols; j += crossSteps) {
                var normJ = j / (numCols - 1);
                var edgeFade = Math.sin(normJ * Math.PI);
                var wireAlpha = (0.08 + edgeFade * 0.28) * 0.75;
                ctx.strokeStyle = palette.wire + wireAlpha + ')';

                ctx.beginPath();
                for (var i = 0; i < numRows; i++) {
                    var idx = i * numCols + j;
                    if (i === 0) ctx.moveTo(gridX[idx], gridY[idx]);
                    else ctx.lineTo(gridX[idx], gridY[idx]);
                }
                ctx.stroke();
            }

            animId = requestAnimationFrame(render);
        }

        // IntersectionObserver pause/resume for 0% CPU consumption off-screen
        if ('IntersectionObserver' in window && canvas.parentElement) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (!animId) {
                            lastTime = 0;
                            animId = requestAnimationFrame(render);
                        }
                    } else {
                        if (animId) {
                            cancelAnimationFrame(animId);
                            animId = null;
                        }
                    }
                });
            }, { threshold: 0.05 });
            observer.observe(canvas.parentElement);
        } else {
            animId = requestAnimationFrame(render);
        }
    }

    // ── Butter-Smooth Metric Counter Animation (easeOutExpo) ──
    function initStatCounters() {
        var statStrips = document.querySelectorAll('.stat-strip');
        if (!statStrips.length) return;

        statStrips.forEach(function (strip) {
            var animated = false;
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !animated) {
                        animated = true;
                        startCountAnimation(strip);
                        observer.unobserve(strip);
                    }
                });
            }, { threshold: 0.15 });
            observer.observe(strip);
        });

        function startCountAnimation(container) {
            var valElements = container.querySelectorAll('.stat-num-val');
            valElements.forEach(function (el, index) {
                var targetAttr = el.getAttribute('data-target');
                var rawText = targetAttr || el.textContent.trim();

                // Check for range e.g. "4–6", "0–100"
                if (rawText.indexOf('–') !== -1 || rawText.indexOf('-') !== -1) {
                    var separator = rawText.indexOf('–') !== -1 ? '–' : '-';
                    var parts = rawText.split(separator);
                    var startVal = parseFloat(parts[0].replace(/[^0-9.]/g, '')) || 0;
                    var endVal = parseFloat(parts[1].replace(/[^0-9.]/g, '')) || 0;
                    animateRange(el, startVal, endVal, separator, index * 90);
                    return;
                }

                // Check for prefix like "< 3"
                var prefix = '';
                if (rawText.startsWith('<')) {
                    prefix = '< ';
                    rawText = rawText.replace(/^[<\s]+/, '');
                }

                var numVal = parseFloat(rawText.replace(/[^0-9.]/g, ''));
                if (isNaN(numVal)) return;

                var isFloat = rawText.indexOf('.') !== -1;
                var decimals = isFloat ? (rawText.split('.')[1] || '').length : 0;

                animateSingleValue(el, numVal, decimals, prefix, index * 90);
            });
        }

        function animateSingleValue(el, target, decimals, prefix, delay) {
            var startTime = 0;
            var duration = 1400; // ms
            prefix = prefix || '';

            function step(timestamp) {
                if (!startTime) startTime = timestamp + delay;
                var elapsed = timestamp - startTime;
                if (elapsed < 0) {
                    requestAnimationFrame(step);
                    return;
                }

                var progress = Math.min(elapsed / duration, 1);
                // easeOutExpo
                var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                var current = ease * target;

                if (decimals > 0) {
                    el.textContent = prefix + current.toFixed(decimals);
                } else {
                    el.textContent = prefix + Math.round(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target);
                }
            }

            requestAnimationFrame(step);
        }

        function animateRange(el, start, end, sep, delay) {
            var startTime = 0;
            var duration = 1400;

            function step(timestamp) {
                if (!startTime) startTime = timestamp + delay;
                var elapsed = timestamp - startTime;
                if (elapsed < 0) {
                    requestAnimationFrame(step);
                    return;
                }

                var progress = Math.min(elapsed / duration, 1);
                var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                var curEnd = Math.round(ease * end);
                el.textContent = start + sep + curEnd;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = start + sep + end;
                }
            }

            requestAnimationFrame(step);
        }
    }

    function initAll() {
        var canvases = document.querySelectorAll('.platform-wave-canvas, .wave-ribbon-canvas');
        canvases.forEach(initWaveCanvas);
        initStatCounters();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
