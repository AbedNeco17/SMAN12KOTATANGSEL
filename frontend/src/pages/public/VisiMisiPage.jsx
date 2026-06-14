const misiList = [
  'Meningkatkan pembinaan keimanan dan ketaqwaan kepada Tuhan Yang Maha Esa serta akhlak mulia;',
  'Menciptakan suasana pembelajaran yang bermakna dan menyenangkan bagi peserta didik (student wellbeing) dengan menerapkan metode pembelajaran modern;',
  'Meningkatkan kompetensi pendidik dan tenaga kependidikan melalui pelatihan dan pengembangan profesional secara berkelanjutan;',
  'Menumbuh kembangkan dan mengasah jiwa kewirausahaan melalui pembelajaran intra dan kokurikuler sehingga peserta didik memiliki ketrampilan hidup (life skill) dan siap bersaing di masyarakat;',
  'Mengembangkan budaya literasi sekolah, rasa ingin tahu, toleransi, bekerjasama, disiplin, jujur, kerja keras, kreatif, mandiri dan bertanggung jawab;',
  'Menjadikan lingkungan sekolah yang bersih, indah, terpelihara dan lestari untuk mendukung program sekolah adiwiyata;',
  'Menjalin hubungan yang harmonis antara sekolah dengan wali peserta didik, masyarakat, instansi, dan lembaga terkait dalam rangka mewujudkan visi sekolah.',
  'Mengupayakan pemenuhan sarana prasarana dan pemanfaatan teknologi informasi yang mendukung terselenggaranya kegiatan pembelajaran yang berwawasan global;',
];

const VisiMisiPage = () => {
  return (
    <div className="section-padding">
      <div className="container-main max-w-3xl">
        <h1 className="section-title mb-10">Visi &amp; Misi</h1>

        <section className="mb-10">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-dark-100">
            <h2 className="text-2xl font-extrabold text-primary text-center mb-5 tracking-wide">
              VISI
            </h2>
            <p className="text-dark-700 leading-relaxed text-center text-base font-medium">
              Menjadikan peserta didik beriman dan bertaqwa kepada Tuhan Yang Maha Esa,
              Berakhlak Mulia, Cerdas, Mandiri, Peduli Lingkungan Dan Berwawasan Global
            </p>
          </div>
        </section>

        <section>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-dark-100">
            <h2 className="text-2xl font-extrabold text-primary text-center mb-6 tracking-wide">
              MISI
            </h2>
            <ol className="space-y-4">
              {misiList.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-dark-600 leading-relaxed text-sm">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VisiMisiPage;
