import pickle
import sys
import json
import math

filename = 'nasa_datafile.pickle'
f = open(filename,'rb')
d = pickle.load(f)
d2 = {}
ua_counter = 0
type_of_stars = []
for i in d:
    #f.write(i)
    if d[i]['planet_type'] != 'Unknown' and d[i]['stellar_type'] != "Unknown" and int(d[i]['discovery_date']) != None and int(d[i]['discovery_date']) > 2010 and d[i]['st_dist'] != None and d[i]['pl_radj'] != None and "stellar_type" in d[i] and "st_mass" in d[i] and "st_optmag" in d[i]:
        mass = d[i]['mass_display'].split(" ")
        if " AU " in d[i]['short_description']:
            ua = d[i]['short_description'][:d[i]['short_description'].find(" AU ")]
            digit = False
            s = ""
            l = []
            for m in ua:
                if m not in "0123456789." or m == "." and not digit or m == "." and "." in s:
                    l.append(s)
                    s = ""
                    digit = False
                else:
                    digit = True
                    s+=m
            l.append(s)
            ua2 = ""
            for m in l:
                flag = True
                if m == "":
                    flag = False
                else:
                    for j in m:
                        if j not in "0123456789." or j == "":
                            flag = False
                            break
                if flag:
                    ua2 = m
            d[i]['ua'] = float(ua2)
            if len(mass) == 2:
                if d[i]['stellar_type'] not in type_of_stars:
                    type_of_stars.append(d[i]['stellar_type'])
                if d[i]['stellar_type'] == "Unknown":
                    ua_counter+=1
                d2[i] = d[i]
n = len(list(d2.keys()))
print(n)
mean = 0
for i in d2:
    mean+=d2[i]['ua']
mean/=n
std = 0
for i in d2:
    std+=(d2[i]['ua']-mean)**2
std/=n
std = math.sqrt(std)
z = 3
d3 = {}
for i in d2:
    if (d2[i]['ua']-mean)/std <= z and (d2[i]['ua']-mean)/std >= -z:
        d3[i] = d2[i]
d2 = d3
    
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
