import useNavigation from "@/hooks/useNavigation";
// import useWindowDimensions from "@/hooks/useWindowDimensions";
import ROUTES from "@/routes";
import { CGWCInstantMessage } from "@/store/types";

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  itemContainer: {},
  item: {
    elevation: 5,
    backgroundColor: "transparent"
  },
  imageOverlay: {
    padding: 4,
    opacity: 0.4,
    width: "100%",
    height: "100%",
    borderRadius: 8,
    position: "absolute",
    backgroundColor: "#000"
  },
  itemTextContainer: {
    bottom: 20,
    width: "80%",
    position: "absolute"
  },
  itemText: {
    left: 20,
    opacity: 1,
    zIndex: 10,
    fontSize: 20,
    textAlign: "left",
    flexWrap: "wrap",
    fontWeight: "500",
    color: "#fff"
  },
  itemTextMessage: {
    left: 20,
    opacity: 1,
    zIndex: 10,
    fontSize: 14,
    textAlign: "left",
    flexWrap: "wrap",
    fontWeight: "300",
    color: "#fff"
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    position: "absolute"
  }
};

type Props = {
  item: CGWCInstantMessage;
  index: number;
};

const CarouselItem = ({ item, index }: Props) => {
  const { goto } = useNavigation();
  const handlePress = () => {
    if (item?.messageLink) {
      goto(`${ROUTES.CGWC.path}/cgwc-resources`, { state: item });
    }
  };

  return (
    <div className="w-[90%]" key={index} aria-roledescription="button" onClick={handlePress}>
      <div style={styles.itemContainer}>
        <div
          style={{
            // elevation: 5,
            backgroundColor: "transparent",
            height: "30svh"
          }}
        >
          <img
            // resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              position: "absolute"
            }}
            src={item.imageUrl}
          />
          <div
            style={{
              padding: 4,
              opacity: 0.4,
              width: "100%",
              height: "100%",
              borderRadius: 8,
              position: "absolute",
              backgroundColor: "#000"
            }}
          />
          <div
            style={{
              bottom: 20,
              width: "80%",
              position: "absolute"
            }}
          >
            <p
              style={{
                left: 20,
                opacity: 1,
                zIndex: 10,
                fontSize: 20,
                textAlign: "left",
                flexWrap: "wrap",
                fontWeight: "500",
                color: "#fff"
              }}
            >
              {item.title}
            </p>
            <p
              style={{
                left: 20,
                opacity: 1,
                zIndex: 10,
                fontSize: 14,
                fontStyle: "italic",
                textAlign: "left",
                flexWrap: "wrap",
                fontWeight: "300",
                color: "#fff"
              }}
            >
              {item.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
