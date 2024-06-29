import React from 'react';
import { SafeAreaView } from 'react-native';
import { AdvancedImage } from 'cloudinary-react-native';
import { Cloudinary } from "@cloudinary/url-gen";

// Import required actions.
import { sepia } from "@cloudinary/url-gen/actions/effect";

export default function FilteredImage() {

    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dpjwt3wc0'
        }
    });

    // Use the image with public ID, 'front_face'.
    const myImage = cld.image('cld-sample-2');

    // Apply the transformation.
    myImage
      .effect(sepia());  // Apply a sepia effect.

    // Render the transformed image in a React Native component.
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <AdvancedImage cldImg={myImage} style={{ width: 400, height: 250, alignSelf: 'center'}} />
      </SafeAreaView>
    )
};