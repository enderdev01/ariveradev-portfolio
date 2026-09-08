import { proyectosEjemplo } from "../data/onilabs";

export default function Projects() {
  return (
    <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-text-primary">
            Ejemplos de Proyectos
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Proyectos reales que demuestran nuestra capacidad de entregar soluciones de calidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proyectosEjemplo.map((proyecto) => (
            <div
              key={proyecto.id}
              className="bg-background border border-border rounded-xl p-6 shadow-sm hover-lift hover:border-accent hover:shadow-md flex flex-col justify-between h-[380px] overflow-hidden"
            >
              <div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary">
                  {proyecto.titulo}
                </h3>

                <p className="text-text-secondary mb-4 text-sm line-clamp-3">
                  <span className="font-semibold text-accent">Objetivo:</span>{" "}
                  {proyecto.objetivo}
                </p>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-text-muted mb-2">
                    Stack tecnológico:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proyecto.stack.map((tech, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-accent-soft text-accent rounded border border-accent/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-text-primary mb-6 line-clamp-2">
                  <span className="font-semibold text-primary">Resultado:</span>{" "}
                  {proyecto.resultado}
                </p>
              </div>

              <div className="flex justify-end">
                <a
                  href={proyecto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-lg hover-press"
                >
                  Ver página
                  <span className="text-lg">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
