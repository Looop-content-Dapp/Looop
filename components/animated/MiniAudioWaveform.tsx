import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const MiniAudioWaveform = () => {
    // Update: Increase the variance of maxHeights to make the waveform dynamic
    const minHeight = 6;
    const maxHeights = [10, 20, 22, 30, 20, 10];
    const baseY = 32;
    const barWidth = 3;

    // Create animation values for each bar
    const animationValues = maxHeights.map(() => useRef(new Animated.Value(minHeight)).current);

    const animate = (index: number) => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animationValues[index], {
                    toValue: maxHeights[index],  // Dynamic maximum height
                    duration: 400,
                    easing: Easing.inOut(Easing.quad), // Smoother easing for more organic movement
                    useNativeDriver: false,
                }),
                Animated.timing(animationValues[index], {
                    toValue: minHeight,   // Minimum height
                    duration: 400,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: false,
                }),
            ]),
        ).start();
    };

    useEffect(() => {
        animationValues.forEach((_, index) => {
            // Stagger the animations by 150ms for smoother and more continuous visual effect
            setTimeout(() => {
                animate(index);
            }, index * 60);
        });
    }, []);

    return (
        <Svg width={32} height={baseY} viewBox="0 0 40 32">
        {animationValues.map((animationValue, index) => (
            <AnimatedRect
                key={index}
                x={5 + index * 5}  // Dynamic spacing between bars
                y={Animated.subtract(baseY, animationValue)}
                width={barWidth}
                height={animationValue}
                fill="#A187B5"
            />
        ))}
    </Svg>
    );
};

export default MiniAudioWaveform;
