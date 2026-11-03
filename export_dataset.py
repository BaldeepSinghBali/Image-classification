import os
import json
from datasets import load_dataset
from PIL import Image

def main():
    print("Loading ImageNet-1k dataset (evanarlian/imagenet_1k_resized_256, val split)...")
    ds = load_dataset("evanarlian/imagenet_1k_resized_256", split="val")
    raw_classes = ds.features["label"].names
    
    img_dir = os.path.join("dataset", "images")
    os.makedirs(img_dir, exist_ok=True)

    def find_first_class(patterns):
        for pat in patterns:
            for i, c in enumerate(raw_classes):
                if pat.lower() in c.lower():
                    return i, c
        return None, None

    categories_config = [
        # Dogs & Puppies
        ({"id": "img_01", "title": "Golden Retriever in Park", "category": "dog", "concepts": {"dog": 1.0, "retriever": 0.95, "pet": 0.9, "animal": 0.95, "grass": 0.8, "outdoor": 0.85, "golden": 0.9}}, ["golden retriever"]),
        ({"id": "img_02", "title": "Labrador Retriever", "category": "dog", "concepts": {"dog": 1.0, "labrador": 0.95, "pet": 0.9, "animal": 0.95, "outdoor": 0.8}}, ["Labrador retriever"]),
        ({"id": "img_03", "title": "German Shepherd Dog", "category": "dog", "concepts": {"dog": 1.0, "canine": 0.9, "pet": 0.85, "animal": 0.95, "outdoor": 0.8}}, ["German shepherd"]),
        ({"id": "img_04", "title": "Siberian Husky in Snow", "category": "dog", "concepts": {"dog": 1.0, "husky": 0.95, "animal": 0.95, "snow": 0.85, "outdoor": 0.85, "white": 0.7}}, ["Siberian husky"]),
        ({"id": "img_05", "title": "Pug Companion Dog", "category": "dog", "concepts": {"dog": 1.0, "pug": 0.95, "pet": 0.95, "animal": 0.9, "indoor": 0.7}}, ["pug,"]),
        ({"id": "img_06", "title": "Samoyed White Fluffy Dog", "category": "dog", "concepts": {"dog": 1.0, "pet": 0.9, "animal": 0.9, "white": 0.9, "outdoor": 0.8}}, ["Samoyed"]),
        ({"id": "img_07", "title": "Beagle Hunting Dog", "category": "dog", "concepts": {"dog": 1.0, "pet": 0.9, "animal": 0.9, "outdoor": 0.85, "grass": 0.7}}, ["beagle"]),
        ({"id": "img_08", "title": "Chihuahua Small Pet", "category": "dog", "concepts": {"dog": 1.0, "pet": 0.95, "animal": 0.85, "indoor": 0.8}}, ["Chihuahua"]),

        # Cats & Big Felines
        ({"id": "img_09", "title": "Orange Tabby Cat", "category": "cat", "concepts": {"cat": 1.0, "tabby": 0.95, "pet": 0.9, "animal": 0.9, "orange": 0.85, "indoor": 0.75}}, ["tabby,"]),
        ({"id": "img_10", "title": "Persian Fluffy Cat", "category": "cat", "concepts": {"cat": 1.0, "feline": 0.95, "pet": 0.95, "animal": 0.9, "white": 0.8, "indoor": 0.85}}, ["Persian cat"]),
        ({"id": "img_11", "title": "Siamese Elegant Cat", "category": "cat", "concepts": {"cat": 1.0, "feline": 0.95, "pet": 0.9, "animal": 0.9, "indoor": 0.8}}, ["Siamese cat"]),
        ({"id": "img_12", "title": "African Lion Predator", "category": "wildlife", "concepts": {"lion": 1.0, "wildlife": 0.95, "animal": 0.95, "outdoor": 0.9, "golden": 0.8}}, ["lion, king of beasts"]),
        ({"id": "img_13", "title": "Bengal Tiger in Wild", "category": "wildlife", "concepts": {"tiger": 1.0, "wildlife": 0.95, "animal": 0.95, "outdoor": 0.85, "orange": 0.8}}, ["tiger, Panthera tigris"]),
        ({"id": "img_14", "title": "Cheetah Fast Runner", "category": "wildlife", "concepts": {"cheetah": 1.0, "wildlife": 0.95, "animal": 0.95, "running": 0.85, "outdoor": 0.9}}, ["cheetah,"]),
        ({"id": "img_15", "title": "Spotted Leopard on Branch", "category": "wildlife", "concepts": {"leopard": 1.0, "wildlife": 0.95, "animal": 0.95, "tree": 0.8, "outdoor": 0.85}}, ["leopard, Panthera pardus"]),
        ({"id": "img_16", "title": "Cougar Mountain Lion", "category": "wildlife", "concepts": {"cat": 0.8, "mountain": 0.8, "wildlife": 0.9, "animal": 0.95, "outdoor": 0.9}}, ["cougar, puma"]),

        # Birds & Avians
        ({"id": "img_17", "title": "Scarlet Macaw Parrot", "category": "bird", "concepts": {"bird": 1.0, "feather": 0.9, "wildlife": 0.85, "red": 0.9, "nature": 0.8}}, ["macaw"]),
        ({"id": "img_18", "title": "Toucan Colorful Beak", "category": "bird", "concepts": {"bird": 1.0, "beak": 0.95, "feather": 0.85, "wildlife": 0.85, "nature": 0.85}}, ["toucan"]),
        ({"id": "img_19", "title": "Pink Flamingo in Water", "category": "bird", "concepts": {"bird": 1.0, "flamingo": 0.95, "water": 0.85, "wildlife": 0.85, "red": 0.75, "nature": 0.8}}, ["flamingo"]),
        ({"id": "img_20", "title": "Hummingbird Flying", "category": "bird", "concepts": {"bird": 1.0, "flying": 0.9, "feather": 0.85, "wildlife": 0.8, "flower": 0.8, "nature": 0.85}}, ["hummingbird"]),
        ({"id": "img_21", "title": "Indian Peacock Feathers", "category": "bird", "concepts": {"bird": 1.0, "peacock": 0.95, "feather": 0.95, "blue": 0.9, "green": 0.85, "wildlife": 0.85}}, ["peacock"]),
        ({"id": "img_22", "title": "Bald Eagle Predator Bird", "category": "bird", "concepts": {"bird": 1.0, "eagle": 0.95, "beak": 0.9, "flying": 0.85, "sky": 0.8, "nature": 0.85}}, ["bald eagle"]),
        ({"id": "img_23", "title": "Ostrich Tall Bird", "category": "bird", "concepts": {"bird": 1.0, "ostrich": 0.95, "animal": 0.85, "outdoor": 0.85, "wildlife": 0.85}}, ["ostrich, Struthio"]),
        ({"id": "img_24", "title": "European Robin Songbird", "category": "bird", "concepts": {"bird": 1.0, "feather": 0.85, "beak": 0.8, "nature": 0.85, "tree": 0.75, "red": 0.7}}, ["robin, American robin"]),

        # Marine & Aquatic
        ({"id": "img_25", "title": "Great White Shark", "category": "marine", "concepts": {"shark": 1.0, "water": 0.95, "ocean": 0.95, "sea": 0.9, "wildlife": 0.85, "blue": 0.8}}, ["great white shark"]),
        ({"id": "img_26", "title": "Tiger Shark Swimming", "category": "marine", "concepts": {"shark": 1.0, "water": 0.95, "ocean": 0.9, "sea": 0.9, "wildlife": 0.85, "blue": 0.8}}, ["tiger shark"]),
        ({"id": "img_27", "title": "Goldfish in Clear Water", "category": "marine", "concepts": {"fish": 1.0, "water": 0.9, "pet": 0.85, "golden": 0.9, "yellow": 0.85}}, ["goldfish, Carassius"]),
        ({"id": "img_28", "title": "Sea Lion Marine Mammal", "category": "marine", "concepts": {"animal": 0.95, "water": 0.9, "ocean": 0.85, "beach": 0.8, "wildlife": 0.85}}, ["sea lion"]),
        ({"id": "img_29", "title": "Lionfish Spiny Fins", "category": "marine", "concepts": {"fish": 1.0, "water": 0.95, "ocean": 0.9, "nature": 0.8}}, ["lionfish"]),
        ({"id": "img_30", "title": "Translucent Jellyfish", "category": "marine", "concepts": {"water": 0.95, "ocean": 0.95, "sea": 0.9, "blue": 0.85, "nature": 0.85}}, ["jellyfish"]),

        # Wild Mammals & Primates
        ({"id": "img_31", "title": "Giant Panda Eating Bamboo", "category": "wildlife", "concepts": {"panda": 1.0, "bear": 0.85, "animal": 0.95, "wildlife": 0.9, "tree": 0.8, "black": 0.8, "white": 0.8}}, ["giant panda"]),
        ({"id": "img_32", "title": "African Elephant Safari", "category": "wildlife", "concepts": {"elephant": 1.0, "animal": 0.95, "wildlife": 0.95, "outdoor": 0.9, "nature": 0.85}}, ["African elephant"]),
        ({"id": "img_33", "title": "Zebra Grazing in Grassland", "category": "wildlife", "concepts": {"zebra": 1.0, "animal": 0.95, "grass": 0.85, "outdoor": 0.9, "black": 0.8, "white": 0.8}}, ["zebra"]),
        ({"id": "img_34", "title": "Koala in Eucalyptus Tree", "category": "wildlife", "concepts": {"koala": 1.0, "animal": 0.95, "tree": 0.9, "nature": 0.85, "outdoor": 0.8}}, ["koala,"]),
        ({"id": "img_35", "title": "Chimpanzee Primate", "category": "wildlife", "concepts": {"chimp": 1.0, "monkey": 0.9, "animal": 0.95, "wildlife": 0.9, "nature": 0.85}}, ["chimpanzee,"]),
        ({"id": "img_36", "title": "Mountain Gorilla in Forest", "category": "wildlife", "concepts": {"gorilla": 1.0, "ape": 0.95, "animal": 0.95, "forest": 0.85, "nature": 0.85}}, ["gorilla, Gorilla"]),
        ({"id": "img_37", "title": "Arabian Camel in Desert", "category": "wildlife", "concepts": {"camel": 1.0, "animal": 0.95, "sand": 0.9, "outdoor": 0.9, "wildlife": 0.85}}, ["Arabian camel"]),
        ({"id": "img_38", "title": "Hippopotamus in River", "category": "wildlife", "concepts": {"animal": 0.95, "water": 0.9, "wildlife": 0.9, "outdoor": 0.85, "nature": 0.8}}, ["hippopotamus,"]),
        ({"id": "img_39", "title": "Brown Bear in Wilderness", "category": "wildlife", "concepts": {"bear": 1.0, "animal": 0.95, "forest": 0.85, "wildlife": 0.9, "nature": 0.85}}, ["brown bear"]),
        ({"id": "img_40", "title": "Red Fox in Forest Snow", "category": "wildlife", "concepts": {"animal": 0.95, "wildlife": 0.9, "red": 0.85, "snow": 0.8, "nature": 0.85, "outdoor": 0.85}}, ["red fox,"]),

        # Vehicles & Aviation
        ({"id": "img_41", "title": "Red Sports Car on Road", "category": "car", "concepts": {"car": 1.0, "vehicle": 0.95, "driving": 0.9, "red": 0.9, "road": 0.85, "city": 0.75}}, ["sports car, sport car"]),
        ({"id": "img_42", "title": "Convertible Open Top Car", "category": "car", "concepts": {"car": 1.0, "automobile": 0.95, "vehicle": 0.95, "driving": 0.85, "road": 0.8, "outdoor": 0.8}}, ["convertible"]),
        ({"id": "img_43", "title": "Limousine Luxury Vehicle", "category": "car", "concepts": {"car": 1.0, "sedan": 0.9, "vehicle": 0.95, "city": 0.85, "street": 0.8, "black": 0.7}}, ["limousine, limo"]),
        ({"id": "img_44", "title": "Pickup Truck on Highway", "category": "car", "concepts": {"truck": 1.0, "car": 0.8, "vehicle": 0.95, "driving": 0.85, "highway": 0.85, "road": 0.85}}, ["pickup, pickup truck"]),
        ({"id": "img_45", "title": "Passenger Airliner Jet", "category": "airplane", "concepts": {"airplane": 1.0, "jet": 0.95, "flight": 0.95, "flying": 0.9, "cloud": 0.85, "sky": 0.9, "white": 0.8}}, ["airliner"]),
        ({"id": "img_46", "title": "Military Warplane Jet", "category": "airplane", "concepts": {"airplane": 1.0, "jet": 0.95, "flight": 0.9, "flying": 0.9, "sky": 0.9, "silver": 0.8}}, ["warplane, military plane"]),
        ({"id": "img_47", "title": "Speedboat on Ocean Waves", "category": "ship", "concepts": {"boat": 1.0, "water": 0.95, "ocean": 0.9, "sea": 0.85, "vehicle": 0.8, "outdoor": 0.85}}, ["speedboat"]),
        ({"id": "img_48", "title": "Container Ship Vessel", "category": "ship", "concepts": {"ship": 1.0, "vessel": 0.95, "water": 0.9, "ocean": 0.9, "sea": 0.85, "sailing": 0.8}}, ["container ship"]),
        ({"id": "img_49", "title": "Mountain Bicycle on Trail", "category": "bicycle", "concepts": {"bicycle": 1.0, "bike": 0.95, "cycling": 0.9, "riding": 0.85, "outdoor": 0.85, "nature": 0.8}}, ["mountain bike, all-terrain bike"]),
        ({"id": "img_50", "title": "Motorcycle Moped in City", "category": "vehicle", "concepts": {"vehicle": 0.95, "riding": 0.85, "road": 0.85, "city": 0.8, "street": 0.8}}, ["moped"]),
        ({"id": "img_51", "title": "Steam Locomotive Train", "category": "vehicle", "concepts": {"vehicle": 0.95, "road": 0.75, "outdoor": 0.8, "black": 0.8}}, ["steam locomotive"]),

        # Landscapes & Nature
        ({"id": "img_52", "title": "Snowy Mountain Peak Alp", "category": "mountain", "concepts": {"mountain": 1.0, "peak": 0.95, "snow": 0.9, "alpine": 0.9, "nature": 0.85, "outdoor": 0.9, "white": 0.8}}, ["alp"]),
        ({"id": "img_53", "title": "Volcano Active Mountain", "category": "mountain", "concepts": {"mountain": 1.0, "nature": 0.9, "outdoor": 0.9, "sky": 0.8}}, ["volcano"]),
        ({"id": "img_54", "title": "Seashore Beach & Waves", "category": "beach", "concepts": {"beach": 1.0, "ocean": 0.95, "sea": 0.95, "water": 0.95, "sand": 0.9, "coast": 0.9, "blue": 0.85}}, ["seashore, coast"]),
        ({"id": "img_55", "title": "Lakeside Reflection", "category": "lake", "concepts": {"lake": 1.0, "water": 0.95, "mountain": 0.8, "nature": 0.9, "tree": 0.85, "outdoor": 0.9}}, ["lakeside, lakeshore"]),
        ({"id": "img_56", "title": "Tropical Coral Reef Ocean", "category": "marine", "concepts": {"water": 0.95, "ocean": 0.95, "sea": 0.9, "fish": 0.8, "blue": 0.9, "nature": 0.85}}, ["coral reef"]),

        # Food & Gastronomy
        ({"id": "img_57", "title": "Hot Cheesy Baked Pizza", "category": "food", "concepts": {"food": 1.0, "pizza": 0.95, "meal": 0.9, "dish": 0.9, "dinner": 0.85, "red": 0.75}}, ["pizza, pizza pie"]),
        ({"id": "img_58", "title": "Juicy Cheeseburger Burger", "category": "food", "concepts": {"food": 1.0, "meal": 0.9, "dish": 0.85, "dinner": 0.85}}, ["cheeseburger"]),
        ({"id": "img_59", "title": "Grilled Hotdog Sausage", "category": "food", "concepts": {"food": 1.0, "meal": 0.85, "dish": 0.8}}, ["hotdog, hot dog"]),
        ({"id": "img_60", "title": "Steaming Cup of Espresso", "category": "food", "concepts": {"food": 0.85, "cooking": 0.75, "indoor": 0.8}}, ["espresso"]),
        ({"id": "img_61", "title": "Sweet Ice Cream Sundae", "category": "food", "concepts": {"food": 0.95, "white": 0.75}}, ["ice cream, icecream"]),
        ({"id": "img_62", "title": "Fresh Red Bell Pepper", "category": "food", "concepts": {"food": 0.95, "vegetable": 0.95, "red": 0.95, "nature": 0.8}}, ["bell pepper"]),

        # Sports & Recreation
        ({"id": "img_63", "title": "Soccer Ball on Pitch", "category": "sports", "concepts": {"sports": 1.0, "soccer": 0.95, "football": 0.9, "game": 0.85, "grass": 0.8, "stadium": 0.8}}, ["soccer ball"]),
        ({"id": "img_64", "title": "Basketball Court Game", "category": "sports", "concepts": {"sports": 1.0, "game": 0.85, "player": 0.8, "orange": 0.85}}, ["basketball"]),
        ({"id": "img_65", "title": "Tennis Ball on Court", "category": "sports", "concepts": {"sports": 1.0, "game": 0.85, "player": 0.75, "green": 0.8, "yellow": 0.8}}, ["tennis ball"]),
        ({"id": "img_66", "title": "Baseball Pitcher Game", "category": "sports", "concepts": {"sports": 1.0, "game": 0.85, "player": 0.8, "white": 0.7}}, ["baseball"]),
        ({"id": "img_67", "title": "Rugby Ball on Field", "category": "sports", "concepts": {"sports": 1.0, "football": 0.85, "game": 0.85, "grass": 0.75, "outdoor": 0.8}}, ["rugby ball"]),

        # Landmarks & Architecture
        ({"id": "img_68", "title": "Historic Stone Castle", "category": "architecture", "concepts": {"building": 1.0, "outdoor": 0.85, "nature": 0.8, "tree": 0.75}}, ["castle"]),
        ({"id": "img_69", "title": "Coastal Lighthouse Beacon", "category": "architecture", "concepts": {"building": 0.95, "ocean": 0.85, "sea": 0.85, "coast": 0.85, "outdoor": 0.9, "water": 0.8}}, ["beacon, lighthouse"])
    ]

    items_list = []
    print(f"Exporting {len(categories_config)} high-resolution images from ImageNet...")

    for item_data, patterns in categories_config:
        idx, full_name = find_first_class(patterns)
        if idx is None:
            print("Warning: could not find class for", item_data["title"])
            continue

        val_idx = idx * 50
        raw_label = full_name.split(",")[0].strip()
        filename = f"{item_data['id']}.jpg"
        filepath = os.path.join(img_dir, filename)

        # Save actual high-resolution ImageNet photo
        img = ds[val_idx]["image"].convert("RGB")
        img.save(filepath, "JPEG", quality=85)

        entry = {
            "id": item_data["id"],
            "title": item_data["title"],
            "category": item_data["category"],
            "src": f"dataset/images/{filename}",
            "caption": f"High-resolution ImageNet photograph of a {raw_label} ({full_name}).",
            "concepts": item_data["concepts"]
        }
        items_list.append(entry)

    print(f"Successfully saved {len(items_list)} images to {img_dir}!")

    # Write js/data.js
    js_content = [
        "// =========================================================================",
        "// data.js — Indexed Multimodal Dataset from High-Resolution ImageNet-1k",
        f"// {len(items_list)} Real High-Res Photos across Diverse ImageNet Categories",
        "// =========================================================================",
        "",
        "const DATASET_ITEMS = " + json.dumps(items_list, indent=2) + ";",
        ""
    ]

    with open(os.path.join("js", "data.js"), "w", encoding="utf-8") as f:
        f.write("\n".join(js_content))

    print(f"Successfully generated js/data.js with {len(items_list)} ImageNet dataset items!")

if __name__ == "__main__":
    main()
