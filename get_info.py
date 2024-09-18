import pickle
import sys
import json

filename = 'nasa_datafile2.pickle'
f = open(filename,'rb')
d = pickle.load(f)
d2 = {}
for i in d:
    #f.write(i)
    if d[i]['planet_type'] != 'Unknown' and int(d[i]['discovery_date']) != None and int(d[i]['discovery_date']) > 2014 and d[i]['st_dist'] != None and d[i]['pl_radj'] != None and "stellar_type" in d[i] and "st_mass" in d[i] and "st_optmag" in d[i] and "st_dist" in d[i]:
        mass = d[i]['mass_display'].split(" ")
        if len(mass) == 2:
            d2[i] = d[i]
print(len(list(d2.keys())))
d2 = json.dumps(d2)
s = str(d2)
f.close()
l = []
f = open("data.json",'w')
count = 0
for i in s:
    f.write(i)
    count+=1
    #f.write(str(d[i]['display_name'])+';'+str(d[i]['planet_type'])+';'+str(numb)+';'+str(d[i]['st_dist'])+';'+str(d[i]['pl_radj'])+';'+str(d[i]['discovery_date'])+'\n')
f.close()

print(l)            
#print(d[list(d.keys())[0]])
