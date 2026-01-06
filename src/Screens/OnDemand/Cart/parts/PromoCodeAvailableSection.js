import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../../../../constants/imagePath';
import strings from '../../../../constants/lang';
import colors from '../../../../styles/colors';
import {
    moderateScale,
} from '../../../../styles/responsiveSize';
import { getColorSchema } from '../../../../utils/utils';

/**
 * PromoCodeAvailableSection Part
 * @param {item ,styles,cartData,themeColors, _getAllOffers,_removeCoupon} props 
 * @returns 
 */

function PromoCodeAvailableSection(props) {
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

    const { item=[], styles, cartData, themeColors, _getAllOffers, _removeCoupon } = props;
    console.log(cartData,'cartDatacartData')
    return (
        <>
            {/* offerview */}
            {
                // !!item?.is_promo_code_available && 
                true&&(
                    <TouchableOpacity
                        disabled={!!cartData?.products && cartData?.products[0]?.couponData ? true : false}
                        onPress={() => _getAllOffers(item.vendor, cartData)}
                        style={styles.offersViewB}>
                        {!!cartData?.products && cartData?.products[0]?.couponData ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <View
                                    style={{
                                        flex: 0.7,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <FastImage
                                        source={imagePath.percentage}
                                        resizeMode="contain"
                                        style={{
                                            width: moderateScale(16),
                                            height: moderateScale(16),
                                            tintColor: themeColors.primary_color,
                                        }}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.viewOffers,
                                            { 
                                                marginLeft: moderateScale(10),
                                                color: isDarkMode ? colors.white: colors.black
                                             },
                                        ]}>
                                        {`${cartData?.products[0]?.couponData?.name} ${strings.CODE} ${strings.APPLYED}`}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                onPress={() => _removeCoupon(cartData?.products[0], cartData)}
                                style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                    {/* <Image source={imagePath.crossBlueB}  /> */}
                                    <Text
                                        style={[
                                            styles.removeCoupon,
                                            { 
                                                color: isDarkMode ? colors.white: colors.black
                                            },
                                        ]}>
                                        {strings.REMOVE}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center',flex:1 }}>
                                <FastImage
                                    source={imagePath.percentage}
                                    resizeMode="contain"
                                    style={{
                                        width: moderateScale(24),
                                        height: moderateScale(24),
                                        tintColor: themeColors.primary_color,
                                    }}
                                />

                                <Text
                                    style={[
                                        styles.viewOffers,
                                        { 
                                            marginLeft: moderateScale(10),
                                            color: isDarkMode ? colors.white: colors.black
                                         },
                                    ]}>
                                    {strings.COUPONS_PROMO_CODES}
                                </Text>
                                <View style={{marginLeft:'auto',flexDirection:'row',alignItems:'center'}}>
                                <Image style={{width:15,height:15,tintColor:colors.orange}} source={imagePath.ic_right_arrow}/>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                )
            }
        </>

    )

}
export default React.memo(PromoCodeAvailableSection);