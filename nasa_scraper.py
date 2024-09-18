import requests
import pickle

url = "https://exoplanets.nasa.gov/api/v1/planets/?order=display_name%20asc&per_page=10&search="
d = {}
for i in range(0,575):
    s = "&page="+str(i)
    try:
        data = requests.get(url+s)
        data = data.json()
        for j in data['items']:
            #print(j)
            if j['id'] not in d:
                d[j['id']] = j
    except:
        print("error occurred")

url2 = "https://exoplanets.nasa.gov/api/v1/stars/?order=display_name%20asc&per_page=10&search="
d2 = {}
for i in range(0,443):
    s = "&page="+str(i)
    try:
        data = requests.get(url2+s)
        data = data.json()
        for j in data['items']:
            #print(j)
            if j['id'] not in d2:
                d2[j['id']] = j
    except:
        print("error occurred")
for key in d2:
    if "planet_ids" in d2[key] and "stellar_type" in d2[key] and "st_mass" in d2[key] and "st_optmag" in d2[key] and "st_dist" in d2[key]:
        for i in range(len(d2[key]["planet_ids"])):
            if d2[key]["planet_ids"][i] in d:
                d[d2[key]["planet_ids"][i]]["stellar_type"] = d2[key]["stellar_type"]
                d[d2[key]["planet_ids"][i]]["st_mass"] = float(d2[key]["st_mass"])
                d[d2[key]["planet_ids"][i]]["st_optmag"] = float(d2[key]["st_optmag"])
                d[d2[key]["planet_ids"][i]]["earth_dist"] = float(d2[key]["st_dist"])
            else:
                print("No")
with open('nasa_datafile.pickle', 'wb') as handle:
    pickle.dump(d, handle, protocol=pickle.HIGHEST_PROTOCOL)
