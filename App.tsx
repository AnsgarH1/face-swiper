import React, { useEffect, useState } from "react";
import { Image, ImageURISource, StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";

interface apiResponse {
  age: Number;
  date_added: Date;
  filename: String;
  gender: "female" | "male";
  image_url: ImageURISource;
  name: String;
}

const MAX_LOADED_PROFILES = 10;

export default function App() {
  const [faces, setFaces] = useState<Array<apiResponse>>([]);
  const [loadingState, setLoadingState] = useState<Number>(0);
  const [gender, setGender] = useState<String>("female");
  const [min_age, setMin_Age] = useState<Number>(18);
  const [max_age, setMax_Age] = useState<Number>(35);

  useEffect(() => {
    const newFaces: Array<apiResponse> = [];
    const load = async () => {
      for (let i: number = 0; i < MAX_LOADED_PROFILES; i++) {
        let response: Promise<apiResponse> = await fetch(
          `https://fakeface.rest/face/json?gender=${gender}&minimum_age=${min_age}&maximum_age=${max_age}`
        )
          .then((response) => response.json())
          .catch((error) => console.log(error));
        const newFace = await response;

        const nameResponse: any = await fetch(
          `https://randomname.de/?format=json&count=1&gender=f&maxAge=35`
        )
          .then((response) => response.json())
          .catch((error) => console.log("Fehler:", error));
        const name = await nameResponse;
        console.log("response", name[0]);
        newFaces.push({ ...newFace, name: name[0].firstname });
        setLoadingState(i);
      }
      console.log("newFaces in State:", newFaces);
      setFaces(newFaces);
    };
    load();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.swipeContainer}>
        {faces.length > 0 ? (
          <Swiper
            verticalSwipe={false}
            stackSize={1}
            showSecondCard={true}
            backgroundColor={"#ffffff"}
            cards={[...faces]}
            renderCard={(card) => {
              console.log("Card:", card.image_url);
              return (
                <View style={styles.card}>
                  <Text style={styles.profileText}>{card.name}</Text>
                  <Image
                    source={{ uri: card.image_url }}
                    style={{ width: undefined, height: undefined, flex: 1 }}
                  />
                </View>
              );
            }}
          />
        ) : (
          <Text style={{ textAlign: "center", paddingTop:"40" }}>
            laden.. ({Math.round((loadingState / MAX_LOADED_PROFILES) * 100)}%)
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
  },
  swipeContainer: { width: "100%", height: "90%", margin: 0, padding: 0 },
  card: {
    width: "100%",
    height: "70%",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#454545",
    justifyContent: "center",
    backgroundColor: "white",
    overflow: "hidden",
  },
  profileText: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
});

/**
 * 
 * <Image
        source={{
          uri:
            "https://fakeface.rest/face/view?gender=female&minimum_age=22&maximum_age=35",
        }}
        style={{
          height: 500,
          width: 500
        }}
      />
 */
