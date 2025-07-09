import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Rect, Defs, ClipPath, G, Path } from 'react-native-svg';

const AnimatedLogoFill = () => {
  const [logoColor, setLogoColor] = useState('#040405'); // Initial logo color
  const progress = new Animated.Value(0);
  const [animatedY, setAnimatedY] = useState(200);

  useEffect(() => {
    // Start animation when component mounts
    Animated.timing(progress, {
      toValue: 1,
      duration: 20000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Link animation progress to the animated values
    progress.addListener(({ value }) => {
      const newY = 200 - value * 200; // Animated height for the water fill
      setAnimatedY(newY);

      // Once the fill is complete, change the logo color to white
      if (value === 1) {
        setLogoColor('#FFFFFF');
      }
    });

    return () => {
      // Clean up the listener
      progress.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.svgContainer}>
    <Svg height="215" width="215" viewBox="0 0 215 215" fill="none">
      <Defs>
        <ClipPath id="clip">
          <Rect x="0" y="0" width="215" height="215" rx="107.5" />
        </ClipPath>
      </Defs>

      {/* Background color */}
      <Rect width="215" height="215" rx="107.5" fill="#12141B" />

      {/* Animated Fill Color */}
      <Rect
        x="0"
        y={animatedY} // Animated fill
        width="215"
        height="215"
        fill="#FF8A49"
        clipPath="url(#clip)"
      />

      {/* Looop Logo Paths */}
      <G clipPath="url(#clip)">
        <Path
          d="M80.7941 128.953C76.6814 128.953 72.6611 127.722 69.2415 125.418C65.8219 123.113 63.1567 119.837 61.5829 116.004C60.009 112.171 59.5972 107.953 60.3996 103.884C61.2019 99.8151 63.1824 96.0774 66.0905 93.1438C68.9986 90.2102 72.7037 88.2124 76.7374 87.4031C80.771 86.5937 84.952 87.0091 88.7516 88.5967C92.5513 90.1844 95.7989 92.873 98.0837 96.3225C100.369 99.7721 101.588 103.828 101.588 107.976C101.582 113.538 99.3896 118.87 95.4912 122.802C91.5929 126.735 86.3072 128.947 80.7941 128.953ZM80.7941 94.4693C78.1459 94.4693 75.5571 95.2615 73.3552 96.7457C71.1533 98.2298 69.4371 100.339 68.4237 102.807C67.4102 105.276 67.1451 107.991 67.6617 110.611C68.1784 113.232 69.4536 115.638 71.3262 117.527C73.1987 119.416 75.5846 120.703 78.1819 121.224C80.7792 121.745 83.4714 121.478 85.9181 120.455C88.3647 119.433 90.4559 117.702 91.9272 115.48C93.3985 113.259 94.1837 110.648 94.1837 107.976C94.1792 104.395 92.767 100.963 90.257 98.4305C87.7469 95.8985 84.3438 94.4739 80.7941 94.4693Z"
          fill={logoColor} // Dynamic logo color
        />
        <Path
          d="M107.341 87.0473H107.497C113.012 87.0331 118.306 89.2295 122.216 93.1533C126.126 97.0771 128.33 102.407 128.344 107.97C128.358 113.533 126.181 118.874 122.291 122.818C118.401 126.762 113.118 128.986 107.603 129L107.564 121.531C111.115 121.522 114.517 120.09 117.022 117.551C119.526 115.011 120.929 111.572 120.92 107.99C120.911 104.408 119.492 100.976 116.975 98.449C114.457 95.9222 111.048 94.5077 107.497 94.5166H107.406L107.341 87.0473Z"
          fill={logoColor} // Dynamic logo color
        />
        <Path
          d="M133.997 87.0473H134.153C139.668 87.0331 144.962 89.2295 148.872 93.1533C152.782 97.0771 154.986 102.407 155 107.97C155.014 113.533 152.837 118.874 148.947 122.818C145.057 126.762 139.774 128.986 134.259 129L134.219 121.531C137.771 121.522 141.173 120.09 143.678 117.551C146.182 115.011 147.585 111.572 147.576 107.99C147.567 104.408 146.148 100.976 143.63 98.449C141.113 95.9222 137.704 94.5077 134.153 94.5166H134.061L133.997 87.0473Z"
          fill={logoColor} // Dynamic logo color
        />
      </G>
    </Svg>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040405',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    marginBottom: 20,
  },
});

export default AnimatedLogoFill;
