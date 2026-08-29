import type { CardMandat } from '../../../shared/types/cards.ts'
export const getCardMandatName = (mandat: CardMandat): string => {
  switch (mandat) {
    case 'FBI':
      return 'Federal Bureau of Info'
    case 'SDI':
      return 'Seigneur Des Infos'
    case 'SIB':
      return 'Super Info Bros'
    case 'MIB':
      return 'Men Info Black'
    default:
      //! Should never happen
      console.warn(`Mandat "${mandat}" not found in getCardMandatName`)
      return `${mandat}.DISPLAY_NAME_NOT_FOUND`
  }
}

export const getCardPoleDisplayName = (pole: string): string => {
  switch (pole) {
    case 'tresorerie':
      return 'Pôle trésorerie'
    case 'presidence':
      return 'Pôle présidence'
    case 'communication':
      return 'Pôle communication'
    case 'secretariat':
      return 'Pôle secrétariat'
    case 'evenementiel':
      return 'Pôle événementiel'
    case 'local':
      return 'Pôle local'
    case 'actif':
      return 'Membre actif.ve'
    case 'implique':
      return 'Membre impliqué.e'
    case 'superviseur':
      return 'Pôle superviseur'
    case 'culture':
      return 'Pôle culture'
    case 'pioux':
      return 'Pôle pioux'
    case 'prevention':
      return 'Pôle prévention'
    case 'suivi':
      return 'Pôle suivi'
    case 'pls':
      return 'Pôle PLS'
    case 'pet':
      return 'Familier'
    case 'arena':
      return 'Arène'
    default:
      //! Should never happen
      console.warn(`Pole "${pole}" not found in getCardPoleDisplayName`)
      return `${pole}.DISPLAY_NAME_NOT_FOUND`
  }
}
