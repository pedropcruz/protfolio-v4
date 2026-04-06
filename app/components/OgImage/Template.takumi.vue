<script setup lang="ts">
const {
  title = 'Pedro Cruz — CEO @ SOLOFOUNDER',
  description = 'Design, engineering, and product — solo.',
  category = '',
  tags = []
} = defineProps<{
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
}>();

const truncatedDescription = computed(() => {
  if (!description) return '';
  return description.length > 120
    ? `${description.slice(0, 120)}...`
    : description;
});
</script>

<template>
  <!-- OLED black canvas — Nothing style -->
  <div
    :style="{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#000000',
      overflow: 'hidden'
    }"
  >
    <!-- Dot grid background — covers full canvas -->
    <div
      :style="{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start'
      }"
    >
      <div
        v-for="i in 2400"
        :key="i"
        :style="{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }"
      >
        <div
          :style="{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.20)'
          }"
        />
      </div>
    </div>

    <!-- Content wrapper with padding -->
    <div
      :style="{
        position: 'relative',
        zIndex: '1',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px'
      }"
    >
      <!-- LAYER 3 (tertiary): Top bar — logo + category label -->
      <div
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: '1'
        }"
      >
        <!-- Logo -->
        <img
          src="/img/icon-and-typo.svg"
          alt="Pedro Cruz"
          :style="{
            height: '28px',
            filter: 'invert(1)'
          }"
        />

        <!-- Category pill -->
        <div
          v-if="category"
          :style="{
            border: '1px solid #333333',
            padding: '4px 14px',
            fontSize: '11px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#999999'
          }"
        >
          {{ category }}
        </div>
      </div>

      <!-- LAYER 1 (primary): Title — the ONE thing -->
      <div
        :style="{
          position: 'relative',
          zIndex: '1',
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '16px'
        }"
      >
        <h1
          :style="{
            fontSize: title && title.length > 30 ? '56px' : '72px',
            fontFamily: 'Doto, monospace',
            fontWeight: '900',
            lineHeight: '1.0',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            margin: '0'
          }"
        >
          {{ title }}
        </h1>

        <!-- LAYER 2 (secondary): Description -->
        <p
          v-if="truncatedDescription"
          :style="{
            fontSize: '18px',
            lineHeight: '1.4',
            color: '#999999',
            margin: '0',
            maxWidth: '75%'
          }"
        >
          {{ truncatedDescription }}
        </p>

        <!-- Tags — tertiary metadata -->
        <div
          v-if="tags && tags.length"
          :style="{
            display: 'flex',
            gap: '8px',
            marginTop: '8px',
            flexWrap: 'wrap'
          }"
        >
          <span
            v-for="tag in tags"
            :key="tag"
            :style="{
              border: '1px solid #222222',
              padding: '3px 10px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#666666',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- LAYER 3 (tertiary): Bottom — author attribution -->
      <div
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid #222222',
          paddingTop: '20px',
          position: 'relative',
          zIndex: '1'
        }"
      >
        <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
          <!-- Status dot — one accent moment -->
          <div
            :style="{
              width: '8px',
              height: '8px',
              backgroundColor: '#d4a843',
              borderRadius: '50%'
            }"
          />
          <span
            :style="{
              fontSize: '11px',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#666666'
            }"
          >
            CEO @ SOLOFOUNDER
          </span>
        </div>

        <span
          :style="{
            fontSize: '11px',
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#666666'
          }"
        >
          pedropcruz.pt
        </span>
      </div>
    </div>
  </div>
</template>
