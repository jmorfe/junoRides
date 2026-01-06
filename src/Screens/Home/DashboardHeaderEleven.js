//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import SearchBar from '../../Components/SearchBar';
import colors from '../../styles/colors';
import { moderateScale, moderateScaleVertical } from '../../styles/responsiveSize';
import imagePath from '../../constants/imagePath';
import { TextInput } from 'react-native';
import strings from '../../constants/lang';

// create a component
const DashboardHeaderEleven = () => {
    return (
        <View style={styles.mainView}>
            <View style={{ flexDirection: 'row', }}>
                <View style={styles.searchView}>
                    <Image
                        source={imagePath.searchIcon2} />
                    <TextInput style={{ flex: 1, marginLeft: moderateScale(0), }}
                        placeholder={strings.SEARCH}

                    />

                </View>
                <View style={{ height: moderateScale(48), alignItems: 'flex-end', flex: 0.18 }}>
                    <Image style={{ height: moderateScale(48), width: moderateScale(48), borderRadius: moderateScale(20) }}
                        source={{ uri: 'https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tYW4lMjBwcm9maWxlfGVufDB8fDB8fHww&w=1000&q=80' }} />
                </View>


            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    searchView: {
        borderRadius: moderateScale(12),
        paddingHorizontal: moderateScale(8),
        height: moderateScale(48),
        backgroundColor: colors.white,
        flex: 0.86,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4
    },
    mainView: { marginHorizontal: moderateScale(8), marginVertical: moderateScaleVertical(14) }
});

//make this component available to the app
export default DashboardHeaderEleven;
