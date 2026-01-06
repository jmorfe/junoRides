import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import colors from '../../styles/colors';

import RNRestart from 'react-native-restart';
import BorderTextInput from '../../Components/BorderTextInput';
import ButtonComponent from '../../Components/ButtonComponent';
import { moderateScale } from '../../styles/responsiveSize';
import { getItem, setItem } from '../../utils/utils';
import stylesFunc from './styles';

export default function DeveloperMode() {
    const currentTheme = useSelector((state) => state.appTheme);
    const { themeColors, themeLayouts } = currentTheme;
    const { appStyle } = useSelector((state) => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;


    const styles = stylesFunc({ themeColors, fontFamily });

    const [state, setState] = useState({
        baseUrl: '',
        shortCode: ''
    });

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const { baseUrl, shortCode } = state

    useEffect(() => {
        (async () => {
            const prevCode = await getItem('saveShortCode');
            if (!!prevCode) {
                updateState({ shortCode: prevCode })
            }
        })();
    }, [])

    console.log("shortCodeshortCode",shortCode)


    
    const onDone = () =>{
        setItem('saveShortCode', shortCode).then((res)=>{
            RNRestart.Restart()
        })
        
        // setItem('base_url', baseUrl).then((res)=>{})
        // setItem('saveShortCode', shortCode).then((res)=>{
        //     RNRestart.Restart()
        // })
    }

    return (
        <WrapperContainer
            bgColor={colors.backgroundGreyC}
            statusBarColor={colors.backgroundGreyC}>
            <Header

                centerTitle={'Developer Mode'}
                headerStyle={{ backgroundColor: colors.backgroundGreyC }}
            />

            <View style={styles.headerLine} />
            <View style={{ flex: 1, padding: moderateScale(16) }}>

                {/* <BorderTextInput
                    placeholder='Base URL'
                    value={baseUrl}
                    onChangeText={(val) => updateState({ baseUrl: val })}
                /> */}

                <BorderTextInput
                    placeholder='Short Code'
                    value={shortCode}
                    onChangeText={(val) => updateState({ shortCode: val })}
                    maxLength={6}
                />

                <ButtonComponent 
                btnText={'DONE'}
                onPress={onDone}
                />
            </View>


        </WrapperContainer>
    );
}
