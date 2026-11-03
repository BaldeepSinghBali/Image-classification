// =========================================================================
// data.js — Indexed Multimodal Dataset from High-Resolution ImageNet-1k
// 69 Real High-Res Photos across Diverse ImageNet Categories
// =========================================================================

const DATASET_ITEMS = [
  {
    "id": "img_01",
    "title": "Golden Retriever in Park",
    "category": "dog",
    "src": "dataset/images/img_01.jpg",
    "caption": "High-resolution ImageNet photograph of a golden retriever (golden retriever).",
    "concepts": {
      "dog": 1.0,
      "retriever": 0.95,
      "pet": 0.9,
      "animal": 0.95,
      "grass": 0.8,
      "outdoor": 0.85,
      "golden": 0.9
    }
  },
  {
    "id": "img_02",
    "title": "Labrador Retriever",
    "category": "dog",
    "src": "dataset/images/img_02.jpg",
    "caption": "High-resolution ImageNet photograph of a Labrador retriever (Labrador retriever).",
    "concepts": {
      "dog": 1.0,
      "labrador": 0.95,
      "pet": 0.9,
      "animal": 0.95,
      "outdoor": 0.8
    }
  },
  {
    "id": "img_03",
    "title": "German Shepherd Dog",
    "category": "dog",
    "src": "dataset/images/img_03.jpg",
    "caption": "High-resolution ImageNet photograph of a German shepherd (German shepherd, German shepherd dog, German police dog, alsatian).",
    "concepts": {
      "dog": 1.0,
      "canine": 0.9,
      "pet": 0.85,
      "animal": 0.95,
      "outdoor": 0.8
    }
  },
  {
    "id": "img_04",
    "title": "Siberian Husky in Snow",
    "category": "dog",
    "src": "dataset/images/img_04.jpg",
    "caption": "High-resolution ImageNet photograph of a Siberian husky (Siberian husky).",
    "concepts": {
      "dog": 1.0,
      "husky": 0.95,
      "animal": 0.95,
      "snow": 0.85,
      "outdoor": 0.85,
      "white": 0.7
    }
  },
  {
    "id": "img_05",
    "title": "Pug Companion Dog",
    "category": "dog",
    "src": "dataset/images/img_05.jpg",
    "caption": "High-resolution ImageNet photograph of a pug (pug, pug-dog).",
    "concepts": {
      "dog": 1.0,
      "pug": 0.95,
      "pet": 0.95,
      "animal": 0.9,
      "indoor": 0.7
    }
  },
  {
    "id": "img_06",
    "title": "Samoyed White Fluffy Dog",
    "category": "dog",
    "src": "dataset/images/img_06.jpg",
    "caption": "High-resolution ImageNet photograph of a Samoyed (Samoyed, Samoyede).",
    "concepts": {
      "dog": 1.0,
      "pet": 0.9,
      "animal": 0.9,
      "white": 0.9,
      "outdoor": 0.8
    }
  },
  {
    "id": "img_07",
    "title": "Beagle Hunting Dog",
    "category": "dog",
    "src": "dataset/images/img_07.jpg",
    "caption": "High-resolution ImageNet photograph of a beagle (beagle).",
    "concepts": {
      "dog": 1.0,
      "pet": 0.9,
      "animal": 0.9,
      "outdoor": 0.85,
      "grass": 0.7
    }
  },
  {
    "id": "img_08",
    "title": "Chihuahua Small Pet",
    "category": "dog",
    "src": "dataset/images/img_08.jpg",
    "caption": "High-resolution ImageNet photograph of a Chihuahua (Chihuahua).",
    "concepts": {
      "dog": 1.0,
      "pet": 0.95,
      "animal": 0.85,
      "indoor": 0.8
    }
  },
  {
    "id": "img_09",
    "title": "Orange Tabby Cat",
    "category": "cat",
    "src": "dataset/images/img_09.jpg",
    "caption": "High-resolution ImageNet photograph of a tabby (tabby, tabby cat).",
    "concepts": {
      "cat": 1.0,
      "tabby": 0.95,
      "pet": 0.9,
      "animal": 0.9,
      "orange": 0.85,
      "indoor": 0.75
    }
  },
  {
    "id": "img_10",
    "title": "Persian Fluffy Cat",
    "category": "cat",
    "src": "dataset/images/img_10.jpg",
    "caption": "High-resolution ImageNet photograph of a Persian cat (Persian cat).",
    "concepts": {
      "cat": 1.0,
      "feline": 0.95,
      "pet": 0.95,
      "animal": 0.9,
      "white": 0.8,
      "indoor": 0.85
    }
  },
  {
    "id": "img_11",
    "title": "Siamese Elegant Cat",
    "category": "cat",
    "src": "dataset/images/img_11.jpg",
    "caption": "High-resolution ImageNet photograph of a Siamese cat (Siamese cat, Siamese).",
    "concepts": {
      "cat": 1.0,
      "feline": 0.95,
      "pet": 0.9,
      "animal": 0.9,
      "indoor": 0.8
    }
  },
  {
    "id": "img_12",
    "title": "African Lion Predator",
    "category": "wildlife",
    "src": "dataset/images/img_12.jpg",
    "caption": "High-resolution ImageNet photograph of a lion (lion, king of beasts, Panthera leo).",
    "concepts": {
      "lion": 1.0,
      "wildlife": 0.95,
      "animal": 0.95,
      "outdoor": 0.9,
      "golden": 0.8
    }
  },
  {
    "id": "img_13",
    "title": "Bengal Tiger in Wild",
    "category": "wildlife",
    "src": "dataset/images/img_13.jpg",
    "caption": "High-resolution ImageNet photograph of a tiger (tiger, Panthera tigris).",
    "concepts": {
      "tiger": 1.0,
      "wildlife": 0.95,
      "animal": 0.95,
      "outdoor": 0.85,
      "orange": 0.8
    }
  },
  {
    "id": "img_14",
    "title": "Cheetah Fast Runner",
    "category": "wildlife",
    "src": "dataset/images/img_14.jpg",
    "caption": "High-resolution ImageNet photograph of a cheetah (cheetah, chetah, Acinonyx jubatus).",
    "concepts": {
      "cheetah": 1.0,
      "wildlife": 0.95,
      "animal": 0.95,
      "running": 0.85,
      "outdoor": 0.9
    }
  },
  {
    "id": "img_15",
    "title": "Spotted Leopard on Branch",
    "category": "wildlife",
    "src": "dataset/images/img_15.jpg",
    "caption": "High-resolution ImageNet photograph of a leopard (leopard, Panthera pardus).",
    "concepts": {
      "leopard": 1.0,
      "wildlife": 0.95,
      "animal": 0.95,
      "tree": 0.8,
      "outdoor": 0.85
    }
  },
  {
    "id": "img_16",
    "title": "Cougar Mountain Lion",
    "category": "wildlife",
    "src": "dataset/images/img_16.jpg",
    "caption": "High-resolution ImageNet photograph of a cougar (cougar, puma, catamount, mountain lion, painter, panther, Felis concolor).",
    "concepts": {
      "cat": 0.8,
      "mountain": 0.8,
      "wildlife": 0.9,
      "animal": 0.95,
      "outdoor": 0.9
    }
  },
  {
    "id": "img_17",
    "title": "Scarlet Macaw Parrot",
    "category": "bird",
    "src": "dataset/images/img_17.jpg",
    "caption": "High-resolution ImageNet photograph of a macaw (macaw).",
    "concepts": {
      "bird": 1.0,
      "feather": 0.9,
      "wildlife": 0.85,
      "red": 0.9,
      "nature": 0.8
    }
  },
  {
    "id": "img_18",
    "title": "Toucan Colorful Beak",
    "category": "bird",
    "src": "dataset/images/img_18.jpg",
    "caption": "High-resolution ImageNet photograph of a toucan (toucan).",
    "concepts": {
      "bird": 1.0,
      "beak": 0.95,
      "feather": 0.85,
      "wildlife": 0.85,
      "nature": 0.85
    }
  },
  {
    "id": "img_19",
    "title": "Pink Flamingo in Water",
    "category": "bird",
    "src": "dataset/images/img_19.jpg",
    "caption": "High-resolution ImageNet photograph of a flamingo (flamingo).",
    "concepts": {
      "bird": 1.0,
      "flamingo": 0.95,
      "water": 0.85,
      "wildlife": 0.85,
      "red": 0.75,
      "nature": 0.8
    }
  },
  {
    "id": "img_20",
    "title": "Hummingbird Flying",
    "category": "bird",
    "src": "dataset/images/img_20.jpg",
    "caption": "High-resolution ImageNet photograph of a hummingbird (hummingbird).",
    "concepts": {
      "bird": 1.0,
      "flying": 0.9,
      "feather": 0.85,
      "wildlife": 0.8,
      "flower": 0.8,
      "nature": 0.85
    }
  },
  {
    "id": "img_21",
    "title": "Indian Peacock Feathers",
    "category": "bird",
    "src": "dataset/images/img_21.jpg",
    "caption": "High-resolution ImageNet photograph of a peacock (peacock).",
    "concepts": {
      "bird": 1.0,
      "peacock": 0.95,
      "feather": 0.95,
      "blue": 0.9,
      "green": 0.85,
      "wildlife": 0.85
    }
  },
  {
    "id": "img_22",
    "title": "Bald Eagle Predator Bird",
    "category": "bird",
    "src": "dataset/images/img_22.jpg",
    "caption": "High-resolution ImageNet photograph of a bald eagle (bald eagle, American eagle, Haliaeetus leucocephalus).",
    "concepts": {
      "bird": 1.0,
      "eagle": 0.95,
      "beak": 0.9,
      "flying": 0.85,
      "sky": 0.8,
      "nature": 0.85
    }
  },
  {
    "id": "img_23",
    "title": "Ostrich Tall Bird",
    "category": "bird",
    "src": "dataset/images/img_23.jpg",
    "caption": "High-resolution ImageNet photograph of a ostrich (ostrich, Struthio camelus).",
    "concepts": {
      "bird": 1.0,
      "ostrich": 0.95,
      "animal": 0.85,
      "outdoor": 0.85,
      "wildlife": 0.85
    }
  },
  {
    "id": "img_24",
    "title": "European Robin Songbird",
    "category": "bird",
    "src": "dataset/images/img_24.jpg",
    "caption": "High-resolution ImageNet photograph of a robin (robin, American robin, Turdus migratorius).",
    "concepts": {
      "bird": 1.0,
      "feather": 0.85,
      "beak": 0.8,
      "nature": 0.85,
      "tree": 0.75,
      "red": 0.7
    }
  },
  {
    "id": "img_25",
    "title": "Great White Shark",
    "category": "marine",
    "src": "dataset/images/img_25.jpg",
    "caption": "High-resolution ImageNet photograph of a great white shark (great white shark, white shark, man-eater, man-eating shark, Carcharodon carcharias).",
    "concepts": {
      "shark": 1.0,
      "water": 0.95,
      "ocean": 0.95,
      "sea": 0.9,
      "wildlife": 0.85,
      "blue": 0.8
    }
  },
  {
    "id": "img_26",
    "title": "Tiger Shark Swimming",
    "category": "marine",
    "src": "dataset/images/img_26.jpg",
    "caption": "High-resolution ImageNet photograph of a tiger shark (tiger shark, Galeocerdo cuvieri).",
    "concepts": {
      "shark": 1.0,
      "water": 0.95,
      "ocean": 0.9,
      "sea": 0.9,
      "wildlife": 0.85,
      "blue": 0.8
    }
  },
  {
    "id": "img_27",
    "title": "Goldfish in Clear Water",
    "category": "marine",
    "src": "dataset/images/img_27.jpg",
    "caption": "High-resolution ImageNet photograph of a goldfish (goldfish, Carassius auratus).",
    "concepts": {
      "fish": 1.0,
      "water": 0.9,
      "pet": 0.85,
      "golden": 0.9,
      "yellow": 0.85
    }
  },
  {
    "id": "img_28",
    "title": "Sea Lion Marine Mammal",
    "category": "marine",
    "src": "dataset/images/img_28.jpg",
    "caption": "High-resolution ImageNet photograph of a sea lion (sea lion).",
    "concepts": {
      "animal": 0.95,
      "water": 0.9,
      "ocean": 0.85,
      "beach": 0.8,
      "wildlife": 0.85
    }
  },
  {
    "id": "img_29",
    "title": "Lionfish Spiny Fins",
    "category": "marine",
    "src": "dataset/images/img_29.jpg",
    "caption": "High-resolution ImageNet photograph of a lionfish (lionfish).",
    "concepts": {
      "fish": 1.0,
      "water": 0.95,
      "ocean": 0.9,
      "nature": 0.8
    }
  },
  {
    "id": "img_30",
    "title": "Translucent Jellyfish",
    "category": "marine",
    "src": "dataset/images/img_30.jpg",
    "caption": "High-resolution ImageNet photograph of a jellyfish (jellyfish).",
    "concepts": {
      "water": 0.95,
      "ocean": 0.95,
      "sea": 0.9,
      "blue": 0.85,
      "nature": 0.85
    }
  },
  {
    "id": "img_31",
    "title": "Giant Panda Eating Bamboo",
    "category": "wildlife",
    "src": "dataset/images/img_31.jpg",
    "caption": "High-resolution ImageNet photograph of a giant panda (giant panda, panda, panda bear, coon bear, Ailuropoda melanoleuca).",
    "concepts": {
      "panda": 1.0,
      "bear": 0.85,
      "animal": 0.95,
      "wildlife": 0.9,
      "tree": 0.8,
      "black": 0.8,
      "white": 0.8
    }
  },
  {
    "id": "img_32",
    "title": "African Elephant Safari",
    "category": "wildlife",
    "src": "dataset/images/img_32.jpg",
    "caption": "High-resolution ImageNet photograph of a African elephant (African elephant, Loxodonta africana).",
    "concepts": {
      "elephant": 1.0,
      "animal": 0.95,
      "wildlife": 0.95,
      "outdoor": 0.9,
      "nature": 0.85
    }
  },
  {
    "id": "img_33",
    "title": "Zebra Grazing in Grassland",
    "category": "wildlife",
    "src": "dataset/images/img_33.jpg",
    "caption": "High-resolution ImageNet photograph of a zebra (zebra).",
    "concepts": {
      "zebra": 1.0,
      "animal": 0.95,
      "grass": 0.85,
      "outdoor": 0.9,
      "black": 0.8,
      "white": 0.8
    }
  },
  {
    "id": "img_34",
    "title": "Koala in Eucalyptus Tree",
    "category": "wildlife",
    "src": "dataset/images/img_34.jpg",
    "caption": "High-resolution ImageNet photograph of a koala (koala, koala bear, kangaroo bear, native bear, Phascolarctos cinereus).",
    "concepts": {
      "koala": 1.0,
      "animal": 0.95,
      "tree": 0.9,
      "nature": 0.85,
      "outdoor": 0.8
    }
  },
  {
    "id": "img_35",
    "title": "Chimpanzee Primate",
    "category": "wildlife",
    "src": "dataset/images/img_35.jpg",
    "caption": "High-resolution ImageNet photograph of a chimpanzee (chimpanzee, chimp, Pan troglodytes).",
    "concepts": {
      "chimp": 1.0,
      "monkey": 0.9,
      "animal": 0.95,
      "wildlife": 0.9,
      "nature": 0.85
    }
  },
  {
    "id": "img_36",
    "title": "Mountain Gorilla in Forest",
    "category": "wildlife",
    "src": "dataset/images/img_36.jpg",
    "caption": "High-resolution ImageNet photograph of a gorilla (gorilla, Gorilla gorilla).",
    "concepts": {
      "gorilla": 1.0,
      "ape": 0.95,
      "animal": 0.95,
      "forest": 0.85,
      "nature": 0.85
    }
  },
  {
    "id": "img_37",
    "title": "Arabian Camel in Desert",
    "category": "wildlife",
    "src": "dataset/images/img_37.jpg",
    "caption": "High-resolution ImageNet photograph of a Arabian camel (Arabian camel, dromedary, Camelus dromedarius).",
    "concepts": {
      "camel": 1.0,
      "animal": 0.95,
      "sand": 0.9,
      "outdoor": 0.9,
      "wildlife": 0.85
    }
  },
  {
    "id": "img_38",
    "title": "Hippopotamus in River",
    "category": "wildlife",
    "src": "dataset/images/img_38.jpg",
    "caption": "High-resolution ImageNet photograph of a hippopotamus (hippopotamus, hippo, river horse, Hippopotamus amphibius).",
    "concepts": {
      "animal": 0.95,
      "water": 0.9,
      "wildlife": 0.9,
      "outdoor": 0.85,
      "nature": 0.8
    }
  },
  {
    "id": "img_39",
    "title": "Brown Bear in Wilderness",
    "category": "wildlife",
    "src": "dataset/images/img_39.jpg",
    "caption": "High-resolution ImageNet photograph of a brown bear (brown bear, bruin, Ursus arctos).",
    "concepts": {
      "bear": 1.0,
      "animal": 0.95,
      "forest": 0.85,
      "wildlife": 0.9,
      "nature": 0.85
    }
  },
  {
    "id": "img_40",
    "title": "Red Fox in Forest Snow",
    "category": "wildlife",
    "src": "dataset/images/img_40.jpg",
    "caption": "High-resolution ImageNet photograph of a red fox (red fox, Vulpes vulpes).",
    "concepts": {
      "animal": 0.95,
      "wildlife": 0.9,
      "red": 0.85,
      "snow": 0.8,
      "nature": 0.85,
      "outdoor": 0.85
    }
  },
  {
    "id": "img_41",
    "title": "Red Sports Car on Road",
    "category": "car",
    "src": "dataset/images/img_41.jpg",
    "caption": "High-resolution ImageNet photograph of a sports car (sports car, sport car).",
    "concepts": {
      "car": 1.0,
      "vehicle": 0.95,
      "driving": 0.9,
      "red": 0.9,
      "road": 0.85,
      "city": 0.75
    }
  },
  {
    "id": "img_42",
    "title": "Convertible Open Top Car",
    "category": "car",
    "src": "dataset/images/img_42.jpg",
    "caption": "High-resolution ImageNet photograph of a convertible (convertible).",
    "concepts": {
      "car": 1.0,
      "automobile": 0.95,
      "vehicle": 0.95,
      "driving": 0.85,
      "road": 0.8,
      "outdoor": 0.8
    }
  },
  {
    "id": "img_43",
    "title": "Limousine Luxury Vehicle",
    "category": "car",
    "src": "dataset/images/img_43.jpg",
    "caption": "High-resolution ImageNet photograph of a limousine (limousine, limo).",
    "concepts": {
      "car": 1.0,
      "sedan": 0.9,
      "vehicle": 0.95,
      "city": 0.85,
      "street": 0.8,
      "black": 0.7
    }
  },
  {
    "id": "img_44",
    "title": "Pickup Truck on Highway",
    "category": "car",
    "src": "dataset/images/img_44.jpg",
    "caption": "High-resolution ImageNet photograph of a pickup (pickup, pickup truck).",
    "concepts": {
      "truck": 1.0,
      "car": 0.8,
      "vehicle": 0.95,
      "driving": 0.85,
      "highway": 0.85,
      "road": 0.85
    }
  },
  {
    "id": "img_45",
    "title": "Passenger Airliner Jet",
    "category": "airplane",
    "src": "dataset/images/img_45.jpg",
    "caption": "High-resolution ImageNet photograph of a airliner (airliner).",
    "concepts": {
      "airplane": 1.0,
      "jet": 0.95,
      "flight": 0.95,
      "flying": 0.9,
      "cloud": 0.85,
      "sky": 0.9,
      "white": 0.8
    }
  },
  {
    "id": "img_46",
    "title": "Military Warplane Jet",
    "category": "airplane",
    "src": "dataset/images/img_46.jpg",
    "caption": "High-resolution ImageNet photograph of a warplane (warplane, military plane).",
    "concepts": {
      "airplane": 1.0,
      "jet": 0.95,
      "flight": 0.9,
      "flying": 0.9,
      "sky": 0.9,
      "silver": 0.8
    }
  },
  {
    "id": "img_47",
    "title": "Speedboat on Ocean Waves",
    "category": "ship",
    "src": "dataset/images/img_47.jpg",
    "caption": "High-resolution ImageNet photograph of a speedboat (speedboat).",
    "concepts": {
      "boat": 1.0,
      "water": 0.95,
      "ocean": 0.9,
      "sea": 0.85,
      "vehicle": 0.8,
      "outdoor": 0.85
    }
  },
  {
    "id": "img_48",
    "title": "Container Ship Vessel",
    "category": "ship",
    "src": "dataset/images/img_48.jpg",
    "caption": "High-resolution ImageNet photograph of a container ship (container ship, containership, container vessel).",
    "concepts": {
      "ship": 1.0,
      "vessel": 0.95,
      "water": 0.9,
      "ocean": 0.9,
      "sea": 0.85,
      "sailing": 0.8
    }
  },
  {
    "id": "img_49",
    "title": "Mountain Bicycle on Trail",
    "category": "bicycle",
    "src": "dataset/images/img_49.jpg",
    "caption": "High-resolution ImageNet photograph of a mountain bike (mountain bike, all-terrain bike, off-roader).",
    "concepts": {
      "bicycle": 1.0,
      "bike": 0.95,
      "cycling": 0.9,
      "riding": 0.85,
      "outdoor": 0.85,
      "nature": 0.8
    }
  },
  {
    "id": "img_50",
    "title": "Motorcycle Moped in City",
    "category": "vehicle",
    "src": "dataset/images/img_50.jpg",
    "caption": "High-resolution ImageNet photograph of a moped (moped).",
    "concepts": {
      "vehicle": 0.95,
      "riding": 0.85,
      "road": 0.85,
      "city": 0.8,
      "street": 0.8
    }
  },
  {
    "id": "img_51",
    "title": "Steam Locomotive Train",
    "category": "vehicle",
    "src": "dataset/images/img_51.jpg",
    "caption": "High-resolution ImageNet photograph of a steam locomotive (steam locomotive).",
    "concepts": {
      "vehicle": 0.95,
      "road": 0.75,
      "outdoor": 0.8,
      "black": 0.8
    }
  },
  {
    "id": "img_52",
    "title": "Snowy Mountain Peak Alp",
    "category": "mountain",
    "src": "dataset/images/img_52.jpg",
    "caption": "High-resolution ImageNet photograph of a red-backed sandpiper (red-backed sandpiper, dunlin, Erolia alpina).",
    "concepts": {
      "mountain": 1.0,
      "peak": 0.95,
      "snow": 0.9,
      "alpine": 0.9,
      "nature": 0.85,
      "outdoor": 0.9,
      "white": 0.8
    }
  },
  {
    "id": "img_53",
    "title": "Volcano Active Mountain",
    "category": "mountain",
    "src": "dataset/images/img_53.jpg",
    "caption": "High-resolution ImageNet photograph of a volcano (volcano).",
    "concepts": {
      "mountain": 1.0,
      "nature": 0.9,
      "outdoor": 0.9,
      "sky": 0.8
    }
  },
  {
    "id": "img_54",
    "title": "Seashore Beach & Waves",
    "category": "beach",
    "src": "dataset/images/img_54.jpg",
    "caption": "High-resolution ImageNet photograph of a seashore (seashore, coast, seacoast, sea-coast).",
    "concepts": {
      "beach": 1.0,
      "ocean": 0.95,
      "sea": 0.95,
      "water": 0.95,
      "sand": 0.9,
      "coast": 0.9,
      "blue": 0.85
    }
  },
  {
    "id": "img_55",
    "title": "Lakeside Reflection",
    "category": "lake",
    "src": "dataset/images/img_55.jpg",
    "caption": "High-resolution ImageNet photograph of a lakeside (lakeside, lakeshore).",
    "concepts": {
      "lake": 1.0,
      "water": 0.95,
      "mountain": 0.8,
      "nature": 0.9,
      "tree": 0.85,
      "outdoor": 0.9
    }
  },
  {
    "id": "img_56",
    "title": "Tropical Coral Reef Ocean",
    "category": "marine",
    "src": "dataset/images/img_56.jpg",
    "caption": "High-resolution ImageNet photograph of a coral reef (coral reef).",
    "concepts": {
      "water": 0.95,
      "ocean": 0.95,
      "sea": 0.9,
      "fish": 0.8,
      "blue": 0.9,
      "nature": 0.85
    }
  },
  {
    "id": "img_57",
    "title": "Hot Cheesy Baked Pizza",
    "category": "food",
    "src": "dataset/images/img_57.jpg",
    "caption": "High-resolution ImageNet photograph of a pizza (pizza, pizza pie).",
    "concepts": {
      "food": 1.0,
      "pizza": 0.95,
      "meal": 0.9,
      "dish": 0.9,
      "dinner": 0.85,
      "red": 0.75
    }
  },
  {
    "id": "img_58",
    "title": "Juicy Cheeseburger Burger",
    "category": "food",
    "src": "dataset/images/img_58.jpg",
    "caption": "High-resolution ImageNet photograph of a cheeseburger (cheeseburger).",
    "concepts": {
      "food": 1.0,
      "meal": 0.9,
      "dish": 0.85,
      "dinner": 0.85
    }
  },
  {
    "id": "img_59",
    "title": "Grilled Hotdog Sausage",
    "category": "food",
    "src": "dataset/images/img_59.jpg",
    "caption": "High-resolution ImageNet photograph of a hotdog (hotdog, hot dog, red hot).",
    "concepts": {
      "food": 1.0,
      "meal": 0.85,
      "dish": 0.8
    }
  },
  {
    "id": "img_60",
    "title": "Steaming Cup of Espresso",
    "category": "food",
    "src": "dataset/images/img_60.jpg",
    "caption": "High-resolution ImageNet photograph of a espresso maker (espresso maker).",
    "concepts": {
      "food": 0.85,
      "cooking": 0.75,
      "indoor": 0.8
    }
  },
  {
    "id": "img_61",
    "title": "Sweet Ice Cream Sundae",
    "category": "food",
    "src": "dataset/images/img_61.jpg",
    "caption": "High-resolution ImageNet photograph of a ice cream (ice cream, icecream).",
    "concepts": {
      "food": 0.95,
      "white": 0.75
    }
  },
  {
    "id": "img_62",
    "title": "Fresh Red Bell Pepper",
    "category": "food",
    "src": "dataset/images/img_62.jpg",
    "caption": "High-resolution ImageNet photograph of a bell pepper (bell pepper).",
    "concepts": {
      "food": 0.95,
      "vegetable": 0.95,
      "red": 0.95,
      "nature": 0.8
    }
  },
  {
    "id": "img_63",
    "title": "Soccer Ball on Pitch",
    "category": "sports",
    "src": "dataset/images/img_63.jpg",
    "caption": "High-resolution ImageNet photograph of a soccer ball (soccer ball).",
    "concepts": {
      "sports": 1.0,
      "soccer": 0.95,
      "football": 0.9,
      "game": 0.85,
      "grass": 0.8,
      "stadium": 0.8
    }
  },
  {
    "id": "img_64",
    "title": "Basketball Court Game",
    "category": "sports",
    "src": "dataset/images/img_64.jpg",
    "caption": "High-resolution ImageNet photograph of a basketball (basketball).",
    "concepts": {
      "sports": 1.0,
      "game": 0.85,
      "player": 0.8,
      "orange": 0.85
    }
  },
  {
    "id": "img_65",
    "title": "Tennis Ball on Court",
    "category": "sports",
    "src": "dataset/images/img_65.jpg",
    "caption": "High-resolution ImageNet photograph of a tennis ball (tennis ball).",
    "concepts": {
      "sports": 1.0,
      "game": 0.85,
      "player": 0.75,
      "green": 0.8,
      "yellow": 0.8
    }
  },
  {
    "id": "img_66",
    "title": "Baseball Pitcher Game",
    "category": "sports",
    "src": "dataset/images/img_66.jpg",
    "caption": "High-resolution ImageNet photograph of a baseball (baseball).",
    "concepts": {
      "sports": 1.0,
      "game": 0.85,
      "player": 0.8,
      "white": 0.7
    }
  },
  {
    "id": "img_67",
    "title": "Rugby Ball on Field",
    "category": "sports",
    "src": "dataset/images/img_67.jpg",
    "caption": "High-resolution ImageNet photograph of a rugby ball (rugby ball).",
    "concepts": {
      "sports": 1.0,
      "football": 0.85,
      "game": 0.85,
      "grass": 0.75,
      "outdoor": 0.8
    }
  },
  {
    "id": "img_68",
    "title": "Historic Stone Castle",
    "category": "architecture",
    "src": "dataset/images/img_68.jpg",
    "caption": "High-resolution ImageNet photograph of a castle (castle).",
    "concepts": {
      "building": 1.0,
      "outdoor": 0.85,
      "nature": 0.8,
      "tree": 0.75
    }
  },
  {
    "id": "img_69",
    "title": "Coastal Lighthouse Beacon",
    "category": "architecture",
    "src": "dataset/images/img_69.jpg",
    "caption": "High-resolution ImageNet photograph of a beacon (beacon, lighthouse, beacon light, pharos).",
    "concepts": {
      "building": 0.95,
      "ocean": 0.85,
      "sea": 0.85,
      "coast": 0.85,
      "outdoor": 0.9,
      "water": 0.8
    }
  }
];
