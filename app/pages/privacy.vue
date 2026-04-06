<script setup lang="ts">
const { locale } = useI18n();
const isPt = computed(() => locale.value === 'pt');
</script>

<template>
  <div class="min-h-screen bg-surface text-text-primary">
    <div class="max-w-3xl mx-auto px-6 py-24">
      <h1 class="text-4xl md:text-6xl font-display text-white uppercase mb-12 leading-[0.9]">
        {{ isPt ? 'Politica de Privacidade' : 'Privacy Policy' }}
      </h1>

      <div class="space-y-10 font-mono text-sm text-text-secondary leading-relaxed">
        <!-- Responsible -->
        <section>
          <h2 class="text-lg font-bold text-text-primary uppercase mb-3">
            {{ isPt ? 'Responsavel pelo Tratamento' : 'Data Controller' }}
          </h2>
          <p>
            Pedro Cruz<br />
            Email: <a href="mailto:me@pedropcruz.pt" class="text-accent hover:underline">me@pedropcruz.pt</a><br />
            Website: <a href="https://pedropcruz.pt" class="text-accent hover:underline">pedropcruz.pt</a>
          </p>
        </section>

        <!-- Data collected -->
        <section>
          <h2 class="text-lg font-bold text-text-primary uppercase mb-3">
            {{ isPt ? 'Dados Recolhidos' : 'Data Collected' }}
          </h2>
          <p class="mb-3">
            {{ isPt
              ? 'Quando utilizas a Calculadora de Escopo de Projeto, recolhemos os seguintes dados:'
              : 'When you use the Project Scope Calculator, we collect the following data:'
            }}
          </p>
          <ul class="list-disc list-inside space-y-1">
            <li>{{ isPt ? 'Nome e email' : 'Name and email' }}</li>
            <li>{{ isPt ? 'Tipo de projeto, servicos selecionados e velocidade' : 'Project type, selected services, and velocity' }}</li>
            <li>{{ isPt ? 'Descricao do projeto (respostas as 3 perguntas guiadas)' : 'Project description (answers to 3 guided questions)' }}</li>
            <li>{{ isPt ? 'Range de budget ou horas mensais' : 'Budget range or monthly hours' }}</li>
            <li>{{ isPt ? 'Endereco IP (apenas para limitacao de taxa, nao para profiling)' : 'IP address (for rate limiting only, not for profiling)' }}</li>
            <li>{{ isPt ? 'Parametros UTM (fonte de trafego)' : 'UTM parameters (traffic source)' }}</li>
            <li>{{ isPt ? 'Idioma preferido (PT/EN)' : 'Preferred language (PT/EN)' }}</li>
          </ul>
        </section>

        <!-- Purpose -->
        <section>
          <h2 class="text-lg font-bold text-text-primary uppercase mb-3">
            {{ isPt ? 'Finalidade' : 'Purpose' }}
          </h2>
          <ul class="list-disc list-inside space-y-1">
            <li>{{ isPt ? 'Geracao de estimativa de custo para o teu projeto' : 'Generating a cost estimate for your project' }}</li>
            <li>{{ isPt ? 'Contacto comercial posterior por parte do Pedro' : 'Subsequent commercial contact by Pedro' }}</li>
            <li>{{ isPt ? 'Melhoria do servico atraves de analytics anonimizados' : 'Service improvement through anonymized analytics' }}</li>
          </ul>
        </section>

        <!-- Legal basis -->
        <section>
          <h2 class="text-lg font-bold text-text-primary uppercase mb-3">
            {{ isPt ? 'Base Legal' : 'Legal Basis' }}
          </h2>
          <p>
            {{ isPt
              ? 'O tratamento dos teus dados baseia-se no teu consentimento explicito (Art. 6(1)(a) do RGPD), dado atraves da checkbox obrigatoria no formulario.'
              : 'The processing of your data is based on your explicit consent (Art. 6(1)(a) GDPR), given through the mandatory checkbox on the form.'
            }}
          </p>
        </section>

        <!-- Third parties -->
        <section>
          <h2 class="text-lg font-bold text-text-primary uppercase mb-3">
            {{ isPt ? 'Partilha com Terceiros' : 'Third-Party Sharing' }}
          </h2>
          <p class="mb-3">
            {{ isPt ? 'Os teus dados sao processados pelos seguintes servicos:' : 'Your data is processed by the following services:' }}
          </p>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>Resend</strong> — {{ isPt ? 'Envio de emails transacionais (recibo da estimativa)' : 'Transactional email delivery (estimate receipt)' }}</li>
            <li><strong>PostHog</strong> — {{ isPt ? 'Analytics (alojado na EU)' : 'Analytics (EU hosted)' }}</li>
            <li><strong>Hetzner</strong> — {{ isPt ? 'Alojamento da base de dados (EU)' : 'Database hosting (EU)' }}</li>
          </ul>
        </section>

        <!-- Retention -->
        <section>
          <h2 class="text-lg font-bold text-text-primary uppercase mb-3">
            {{ isPt ? 'Periodo de Retencao' : 'Retention Period' }}
          </h2>
          <p>
            {{ isPt
              ? 'Os teus dados sao retidos por um periodo maximo de 24 meses. Apos este periodo, os dados sao anonimizados ou eliminados.'
              : 'Your data is retained for a maximum period of 24 months. After this period, data is anonymized or deleted.'
            }}
          </p>
        </section>

        <!-- Rights -->
        <section>
          <h2 class="text-lg font-bold text-text-primary uppercase mb-3">
            {{ isPt ? 'Os Teus Direitos' : 'Your Rights' }}
          </h2>
          <p class="mb-3">
            {{ isPt ? 'Nos termos do RGPD, tens direito a:' : 'Under the GDPR, you have the right to:' }}
          </p>
          <ul class="list-disc list-inside space-y-1">
            <li>{{ isPt ? 'Aceder aos teus dados pessoais' : 'Access your personal data' }}</li>
            <li>{{ isPt ? 'Retificar dados incorretos' : 'Rectify incorrect data' }}</li>
            <li>{{ isPt ? 'Eliminar os teus dados (direito ao esquecimento)' : 'Delete your data (right to erasure)' }}</li>
            <li>{{ isPt ? 'Portabilidade dos dados' : 'Data portability' }}</li>
            <li>{{ isPt ? 'Opor-te ao tratamento' : 'Object to processing' }}</li>
          </ul>
          <p class="mt-3">
            {{ isPt
              ? 'Para exerceres qualquer destes direitos, contacta:'
              : 'To exercise any of these rights, contact:'
            }}
            <a href="mailto:me@pedropcruz.pt" class="text-accent hover:underline">me@pedropcruz.pt</a>
          </p>
        </section>

        <!-- Last updated -->
        <section class="border-t border-border pt-6">
          <p class="text-text-disabled text-xs">
            {{ isPt ? 'Ultima atualizacao: Abril 2026' : 'Last updated: April 2026' }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
