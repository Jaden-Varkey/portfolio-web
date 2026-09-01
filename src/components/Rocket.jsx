// The ship art, shared by the custom cursor and the launch intro so there is a
// single source of truth for the shape. Drawn nose-up in a 36x36 box; callers
// rotate or scale it as needed.
export default function Rocket({ className = '' }) {
  return (
    <g className={className}>
      {/* flames (behind the body) */}
      <path className="flame flame-outer" d="M15.4 27 Q18 36 20.6 27 Q18 29.6 15.4 27Z" fill="#ff7a1a" />
      <path className="flame flame-inner" d="M16.7 27 Q18 33 19.3 27 Q18 29 16.7 27Z" fill="#ffd34d" />
      {/* swept-back fins */}
      <path d="M14 18 C11.6 20.2 10 23.2 10.4 26.4 L14 23.6Z" fill="#f5b144" stroke="#0c0e15" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M22 18 C24.4 20.2 26 23.2 25.6 26.4 L22 23.6Z" fill="#f5b144" stroke="#0c0e15" strokeWidth="0.8" strokeLinejoin="round" />
      {/* fuselage (pointed nose, rounded tail) */}
      <path d="M18 2.4 C21 7 22 12 22 16.5 C22 20.8 20.8 23.8 18 25.8 C15.2 23.8 14 20.8 14 16.5 C14 12 15 7 18 2.4Z" fill="#eef1f8" stroke="#0c0e15" strokeWidth="1" strokeLinejoin="round" />
      {/* red nose cone */}
      <path d="M18 2.4 C20 6 21 9 21 11.6 L15 11.6 C15 9 16 6 18 2.4Z" fill="#ff6f5e" stroke="#0c0e15" strokeWidth="0.8" strokeLinejoin="round" />
      {/* nozzle */}
      <path d="M16 25.3 L20 25.3 L19 27.4 L17 27.4Z" fill="#c2c8d4" stroke="#0c0e15" strokeWidth="0.7" strokeLinejoin="round" />
      {/* porthole window */}
      <circle cx="18" cy="15.6" r="2.4" fill="#3186ff" stroke="#dfe6f3" strokeWidth="0.9" />
      <circle cx="18" cy="15.6" r="2.4" fill="none" stroke="#0c0e15" strokeWidth="0.5" />
    </g>
  )
}
