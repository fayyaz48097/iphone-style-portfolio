import devDimensionsLogo from '@/assets/logos/dev-dimensions.svg'
import monetaLogo from '@/assets/logos/moneta.png'
import { linearGradient } from '@/lib/gradient'

/** Shared brand gradients, reused by app icons across sections. */
export const GRADIENTS = Object.freeze({
  brand: linearGradient(135, '#5B2BFF', '#FF4FD8'),
  laravel: linearGradient(150, '#FF6B5B', '#E0263C'),
  orange: linearGradient(150, '#FF9F43', '#FF5E3A'),
  ocean: linearGradient(150, '#3AB0D8', '#00618A'),
  violet: linearGradient(150, '#9F7BFF', '#5B2BFF'),
  pink: linearGradient(150, '#FF7AB6', '#C3268A'),
  green: linearGradient(150, '#3DDC84', '#009639'),
  udemy: linearGradient(150, '#A435F0', '#5624D0'),
})

/*
 * Official company / product logos, as app icons. Colours are sampled from each brand's
 * own assets: Dev Dimensions' favicon slate, and Moneta's email-header teal.
 */
export const BRAND_ICONS = Object.freeze({
  devDimensions: { image: devDimensionsLogo, imageSize: '52%', background: linearGradient(150, '#21434F', '#16313A') },
  moneta: { image: monetaLogo, imageSize: '66%', background: linearGradient(150, '#40A6A4', '#036967') },
})
