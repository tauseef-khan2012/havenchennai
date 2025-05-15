
const ExperiencePhilosophy = () => {
  return (
    <section className="py-12 bg-haven-green text-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-4">Our Experience Philosophy</h2>
            <p className="mb-4">
              At Haven, we believe that meaningful connections with nature and local culture are essential 
              for a truly transformative stay. Our experiences are carefully crafted to be:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Authentic</strong> - Created and led by passionate local experts</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Immersive</strong> - Designed for deep connection with nature</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Sustainable</strong> - Respectful of the environment and local communities</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Small-Group</strong> - Limited to ensure personal attention and minimal impact</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Nature experiences" 
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperiencePhilosophy;
