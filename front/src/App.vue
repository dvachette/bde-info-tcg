<script setup lang="ts">
import { ref } from 'vue';
import CardElement from './components/CardElement.vue';
import type { ArenaInterface, MemberInterface, PetInterface } from '../../shared/types/cards.ts';
const memberCard = ref<MemberInterface>({
  name: "Dona12",
  id: "donadouze",
  description: "Accro à linux, cet adict à la Monster ne manquera pas de vous faire découvrir les joies du pingouin.",
  poles: ["tresorerie", "prevention", "communication"],
  picture: "assets/images/cards/members/donadouze.png",
  health: 100,
  maxHealth: 100,
  attackName: "Super tux",
  attackDescription: "Lance un pingouin sur l'adversaire",
  attackCost: 2,
  attack: "damage:20, heal:0, draw:0, shield:0, energy:0",
  statusEffects: [],
  cardType: "member",
  mandat: "SDI",
});
const petCard = ref<PetInterface>({
  name: "Béboule",
  id: "beboule",
  description: "La mascote du Seigneur Des Infos",
  poles: ["pet"],
  picture: "assets/images/cards/pets/beboule.png",
  cardType: "pet",
  ability: "heal:10, draw:0, shield:0, energy:0",
  abilityDescription: "Soigne 10 points de vie à un membre de l'équipe à chaque tours",
  abilityName: "Câlin",
});
const arenaCard = ref<ArenaInterface>({
  name: "Feyssine",
  id: "feyssine",
  description: "La terre sacrée des IUT. La légende raconte qu'on pourrait y appercevoir des sangliers.",
  poles: ["arena"],
  picture: "assets/images/cards/arenas/feyssine.png",
  cardType: "arena",
  background: "assets/images/backgrounds/arenas/feyssine.png",
});
</script>

<template>
  <div class="cards">
    <CardElement :card="memberCard"></CardElement>
    <CardElement :card="petCard"></CardElement>
    <CardElement :card="arenaCard"></CardElement>
  </div>
</template>

<style scoped>
  .cards {
    display:grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
  }
</style>
