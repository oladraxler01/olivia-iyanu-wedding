"use client";

export default function MasonryGallery() {
  const cards = [
    { title: "Photo Card 1", aspect: "aspect-[3/4]" },
    { title: "Photo Card 2", aspect: "aspect-[4/3]" },
    { title: "Photo Card 3", aspect: "aspect-[3/4]" },
    { title: "Photo Card 4", aspect: "aspect-[4/3]" },
    { title: "Photo Card 5", aspect: "aspect-[3/4]" },
    { title: "Photo Card 6", aspect: "aspect-[4/3]" },
  ];

  return (
    <section id="masonry" className="py-20 px-4 bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B23A6B] mb-2">
            Captured Moments
          </p>
          <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#241B22]">
            Photo Gallery Grid
          </h2>
        </div>

        {/* Masonry / Bento Placeholder Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {cards.map((c, idx) => (
            <div
              key={idx}
              className={`relative ${c.aspect} rounded-3xl bg-[#F3E7EB]/60 border border-dashed border-[#E3D3DA] flex items-center justify-center p-4 text-center shadow-xs hover:border-[#B23A6B] transition-colors`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B5A63]">
                {c.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
