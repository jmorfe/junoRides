//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import fontFamily from '../styles/fontFamily';
import imagePath from '../constants/imagePath';

import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../styles/colors';

// create a component
const AtlanticHeader = ({lefttext,onPressLeft,containerstyle}) => {
    const navigation=useNavigation()
    console.log(navigation,'jhefeiuwg');
    return (
       
    <View style={{...styles.mainview,...containerstyle}}>
        
        <TouchableOpacity onPress={ !!onPressLeft ? onPressLeft : () => navigation.goBack()}>
        <Image source={imagePath.icBackb} />
        </TouchableOpacity>
        <Text style={styles.textstyle}>{lefttext}</Text>
       </View>
        
    );
};

// define your styles
const styles = StyleSheet.create({
    mainview:{flexDirection:'row',padding:moderateScale(14),alignItems:'center',height:moderateScaleVertical(50),borderBottomColor:colors.greyColor,borderBottomWidth:1},
    textstyle:{fontSize:textScale(14),fontFamily:fontFamily.bold,marginLeft:moderateScale(14)}
});

//make this component available to the app
export default AtlanticHeader;
