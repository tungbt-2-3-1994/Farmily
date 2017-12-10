// import { StyleSheet, Dimensions, Platform } from 'react-native';
// import { colors } from './index.style';

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// function wp(percentage) {
//     const value = (percentage * viewportWidth) / 100;
//     return Math.round(value);
// }

// const slideWidth = wp(75);
// const slideHeight = wp(42.1875);

// const itemHorizontalMargin = wp(2);

// export const sliderWidth = viewportWidth;
// export const itemWidth = slideWidth + itemHorizontalMargin * 2;

// const entryBorderRadius = 8;

// export default StyleSheet.create({
//     slideInnerContainer: {
//         width: itemWidth,
//         height: slideHeight,
//         paddingHorizontal: itemHorizontalMargin,
//         // paddingBottom: 10 // needed for shadow
//     },
//     imageContainer: {
//         flex: 1,
//         backgroundColor: 'white',
//         borderRadius: entryBorderRadius,
//         // borderTopRightRadius: entryBorderRadius
//     },
//     imageContainerEven: {
//         backgroundColor: colors.black
//     },
//     image: {
//         ...StyleSheet.absoluteFillObject,
//         resizeMode: 'cover',
//         // borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
//         borderRadius: entryBorderRadius,
//         borderBottomRightRadius: entryBorderRadius
//     },
//     // image's border radius is buggy on ios; let's hack it!
//     radiusMask: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: entryBorderRadius,
//         backgroundColor: 'white'
//     },
//     radiusMaskEven: {
//         backgroundColor: colors.gray
//     },
// });