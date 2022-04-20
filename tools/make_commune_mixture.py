import json


def main():
    with open("../data/geojson/communes.geojson") as f:
        data = json.load(f)
        for row in data["features"]:
            name_french = (row["properties"]["name"]).split(' | ')[0]
            print('----------------------------------------')
            print('----------------------------------------')
            print(row)
            print(name_french)


if __name__ == "__main__":
    main()