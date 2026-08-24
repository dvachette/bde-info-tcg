<script setup lang="ts">
import { computed } from "vue";
import type { AnyCard, PetInterface, MemberInterface, ArenaInterface } from "../../../shared/types/cards"
const props = withDefaults(defineProps<{
    card: AnyCard,
    draggable?: boolean,
}>(), {
    draggable: true,
});
const card = computed(() => props.card)
const isDraggable = computed(() => props.draggable)

const isPet = (card: AnyCard): card is PetInterface => card.cardType === 'pet';
const isMember = (card: AnyCard): card is MemberInterface => card.cardType === 'member';
const isArena = (card: AnyCard): card is ArenaInterface => card.cardType === 'arena';

const emit = defineEmits<{
    (e: 'click', card: AnyCard): void,
    (e: 'attack', card: MemberInterface): void,
}>()

const backgroundStyle = computed(() => {
    const poles = card.value.poles;
    if (poles.length <= 1) {
        return { background: `var(--pole-${poles[0]})` };
    }
    const sweep = 90 / poles.length;
    const stops = poles
        .slice()
        .reverse()
        .map((pole, i) => `var(--pole-${pole}) ${180 + i * sweep}deg ${180 + (i + 1) * sweep}deg`)
        .join(', ');
    return { background: `conic-gradient(at 100% 0%, ${stops})` };
});
</script>
<template>
    <div class="card" :class="'card--' + card.poles[0]" @click="emit('click', card)" :draggable="isDraggable" :style="backgroundStyle">
        <div class="card-header">
            <p>{{ card.name }}</p>
            <div v-if="isMember(card)" class="card-health">
                <p>{{ card.health }} / {{ card.maxHealth }}</p>
            </div>
        </div>
        <div class="card-image" :class="isArena(card) ? 'card-image-arena': ''">
            <img :src="card.picture" alt="Card image" />
        </div>
        <div class="card-attack" v-if="isMember(card)" @click.stop="emit('attack', card)">
            <div class="card-attack-header">
                <p class="card-attack-title">{{ card.attackName }}</p>
                <p class="card-attack-cost">{{ card.attackCost }}</p>
            </div>
            <p class="card-attack-description">{{ card.attackDescription }}</p>
        </div>
        <div class="card-ability" v-if="isPet(card)">
            <div class="card-ability-header">
                <p class="card-ability-title">{{ card.abilityName }}</p>
            </div>
            <p class="card-ability-description">{{ card.abilityDescription }}</p>
        </div>
        <div class="card-footer">
            <p>{{ card.description }}</p>
            <img v-if="isMember(card)" :src="`assets/images/cards/mandats/${card.mandat}.png`" alt="Mandat image" class="card-footer-mandat" />
        </div>

    </div>
</template>
<style scoped lang="scss">
@use "sass:math";
@use "@/constants/colors.scss";
    .card {
        $ratio: 1.61803398875; // Golden ratio
        $corner-radius: 5%;

        overflow: hidden;
        aspect-ratio: 1 / #{$ratio};
        width: 100%;
        border-radius: #{$corner-radius} / #{math.div($corner-radius, $ratio)};
        border: 1px solid ;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease-in-out;
        user-select: none;
        -webkit-user-drag: none;
        
        .card-image, .card-attack, .card-ability, .card-footer {
            min-height: 0; // Allow flex items to shrink below their content size
        }   

        &:hover {
            cursor: pointer;
            transform: scale(1.02);
        }
        &:active {
            transform: scale(0.98);
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            font-weight: bold;
        }
        .card-image {
            width: 90%;
            margin: 0 auto;
            border-radius: 5%;
            overflow: hidden;
            flex: 1 1 auto;
            min-height: 0; // Allow the image container to shrink below its content size
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                pointer-events: none;
            }
        }
        .card-image-arena {
            flex-grow: 1;
            min-height: 0;
        }
        .card-attack {
            padding: 0.5rem;
            margin: 0.5rem;
            display: flex;
            flex-direction: column;
            border-radius: 5%;
            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
            .card-attack-header {
                display: flex;
                justify-content: space-between;
                .card-attack-title {
                    font-weight: bold;
                }
                .card-attack-cost {
                    font-style: italic;
                }
                .card-attack-cost::after {
                    content: "⚡";
                    font-size: 1rem;
                    font-style: normal;
                }
            }
            .card-attack-description {
                font-size: 0.9rem;
                margin-top: 0;
            }
        }
        .card-ability {
            padding: 0.5rem;
            margin: 0.5rem;
            display: flex;
            flex-direction: column;
            border-radius: 5%;
            .card-ability-header {
                display: flex;
                justify-content: space-between;
                .card-ability-title {
                    font-weight: bold;
                }
            }
            .card-ability-description {
                font-size: 0.9rem;
                margin-top: 0;
            }
        }
        .card-footer {
            padding: 0.5rem;
            font-size: 0.9rem;
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
            align-items: flex-start; // Align items to the top of the footer
            p {
                min-width: 0; // Allow the paragraph to shrink below its content size
                flex: 1;
            }
            .card-footer-mandat {
                flex-shrink: 0; // Prevent the image from shrinking
                height: 2.3rem;
                object-fit: cover;
                margin-top: 0.5rem;
            }
        }
    }
    .card--tresorerie {
        background-color: colors.$pole-tresorerie
    }    
    .card--presidence {
        background-color: colors.$pole-presidence
    }
    .card--communication {
        background-color: colors.$pole-communication
    }
    .card--secretariat {
        background-color: colors.$pole-secretariat
    }
    .card--evenementiel {
        background-color: colors.$pole-evenementiel
    }
    .card--local {
        background-color: colors.$pole-local
    }
    .card--actif {
        background-color: colors.$pole-actif
    }
    .card--implique {
        background-color: colors.$pole-implique
    }
    .card--superviseur {
        background-color: colors.$pole-superviseur
    }
    .card--culture {
        background-color: colors.$pole-culture
    }
    .card--pioux {
        background-color: colors.$pole-pioux
    }
    .card--prevention {
        background-color: colors.$pole-prevention
    }
    .card--suivi {
        background-color: colors.$pole-suivi
    }
    .card--pls {
        background-color: colors.$pole-pls
    }
    .card--pet {
        background-color: colors.$pole-pet
    }
    .card--arena {
        background-color: colors.$pole-arena
    }

</style>