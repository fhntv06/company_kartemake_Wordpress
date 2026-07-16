<div class="preloader" data-controller-preloader="item">
    <div class="preloader__container">
        <svg id="preloader-svg" class="preloader__svg" width="1280" height="600" viewBox="0 0 800 300"
             xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#ff6b6b">
                        <animate attributeName="offset" values="-2;2" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="33%" stop-color="#4ecdc4">
                        <animate attributeName="offset" values="-1;3" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="66%" stop-color="#45b7d1">
                        <animate attributeName="offset" values="0;4" dur="3s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%" stop-color="#ff6b6b">
                        <animate attributeName="offset" values="1;5" dur="3s" repeatCount="indefinite"/>
                    </stop>
                </linearGradient>

                <linearGradient id="secondaryGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#ffd93d">
                        <animate attributeName="offset" values="0;1" dur="2.5s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="50%" stop-color="#6c5ce7">
                        <animate attributeName="offset" values="0.5;1.5" dur="2.5s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="100%" stop-color="#ffd93d">
                        <animate attributeName="offset" values="1;2" dur="2.5s" repeatCount="indefinite"/>
                    </stop>
                </linearGradient>

                <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="glow"/>
                    <feComposite in="SourceGraphic" in2="glow" operator="over"/>
                </filter>

                <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -7"/>
                </filter>

                <pattern id="grid" patternUnits="userSpaceOnUse" width="50" height="50">
                    <path d="M 0 0 L 50 0 50 50 0 50 Z" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
                </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5"/>

            <text x="400" y="150" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="80"
                  fill="rgba(255,255,255,0.1)" opacity="0.5">
                KARTEMAKE
            </text>

            <text x="400" y="150" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="80" fill="none"
                  stroke="url(#mainGradient)" stroke-width="2" stroke-dasharray="1000" stroke-dashoffset="1000">
                KARTEMAKE
                <animate attributeName="stroke-dashoffset" values="1000;0;1000" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="stroke-width" values="2;3;2" dur="2s" repeatCount="indefinite"/>
            </text>

            <text x="400" y="150" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="80" fill="none"
                  stroke="url(#secondaryGradient)" stroke-width="1" stroke-dasharray="800" stroke-dashoffset="800"
                  opacity="0.7">
                KARTEMAKE
                <animate attributeName="stroke-dashoffset" values="800;1600;800" dur="3.5s" repeatCount="indefinite"/>
            </text>

            <text x="400" y="150" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="80" fill="none"
                  stroke="rgba(255,255,255,0.3)" stroke-width="4" opacity="0">
                KARTEMAKE
                <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="stroke-width" values="4;8;4" dur="2s" repeatCount="indefinite"/>
            </text>

            <g class="letter-pulses" opacity="0.8">
                <text x="400" y="150" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="80" fill="none"
                      stroke="rgba(255,255,255,0.2)" stroke-width="1">
                    KARTEMAKE
                    <animate attributeName="stroke-width" values="1;2;1" dur="1.5s" repeatCount="indefinite"/>
                </text>
            </g>

            <g class="particles" opacity="0.6">
                <circle cx="100" cy="100" r="2" fill="#ff6b6b">
                    <animate attributeName="cx" values="100;500;100" dur="8s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="100;200;100" dur="6s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="700" cy="200" r="3" fill="#4ecdc4">
                    <animate attributeName="cx" values="700;300;700" dur="7s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="200;100;200" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="300" cy="250" r="2.5" fill="#45b7d1">
                    <animate attributeName="cx" values="300;600;300" dur="9s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="250;150;250" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="100" cy="100" r="2" fill="#ffd93d">
                    <animate attributeName="cx" values="200;350;150" dur="8s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="50;600;150" dur="6s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="700" cy="200" r="3" fill="#6c5ce7">
                    <animate attributeName="cx" values="600;450;750" dur="7s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="10;150;200" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="300" cy="250" r="2.5" fill="#4ecdc4">
                    <animate attributeName="cx" values="700;600;100" dur="9s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="650;150;350" dur="4s" repeatCount="indefinite"/>
                </circle>
            </g>

            <text x="400" y="150" text-anchor="middle" class="final-text" font-family="Arial Black, sans-serif" font-size="80"
                  fill="white" filter="url(#strongGlow)" opacity="0">
                KARTEMAKE
            </text>
        </svg>
    </div>
</div>