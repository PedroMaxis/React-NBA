const Sobre = () => (
  <div className="mx-auto max-w-2xl space-y-6">
    <header>
      <h1 className="font-display text-5xl sm:text-6xl">Sobre</h1>
    </header>
    <section className="space-y-3 text-slate-300">
      <p>
        O <b className="text-white">NBA Log</b> é um projeto de estudo: um painel dos times, jogos e classificação da NBA,
        feito com React, TypeScript e Tailwind.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-white">De onde vêm os dados</h2>
      <p>
        Placares, calendário, classificação, elencos, logos e fotos vêm da API pública da ESPN (não oficial, sem chave).
        O app consulta os dados direto do navegador e guarda uma cópia local: se a conexão cair, mostra a última versão
        salva e avisa que ela pode estar desatualizada. Os jogos do dia atualizam sozinhos a cada 20 segundos.
      </p>
      <p>
        O "dia" dos jogos segue o fuso de Nova York, como a própria NBA/ESPN; os horários de início aparecem no seu fuso.
      </p>
      <p>
        A contagem de títulos é mantida manualmente neste projeto (inclui os conquistados por cada franquia em cidades ou
        nomes anteriores).
      </p>
      <h2 className="pt-2 text-lg font-semibold text-white">Aviso</h2>
      <p>
        NBA, os nomes e logos dos times e as imagens pertencem aos seus respectivos donos. Este projeto não tem fins
        comerciais e não tem vínculo com a NBA, com os times ou com a ESPN.
      </p>
    </section>
  </div>
);

export default Sobre;
