
import requests
from bs4 import BeautifulSoup
import webbrowser

link="https://gaana.com/playlist/gaana-dj-bollywood-top-50-1"
req = requests.get(link)
# print(req)

res=req.text
# print(res)


soup=BeautifulSoup(res,"html.parser")
url = soup.findAll("ul",class_="list_data")
# print(url, "url")
url_list=[]
gaana_naam=[]
num=0
for i in url:
    url_1= "https://gaana.com" + i.find("a")["href"]
    url_list.append(url_1)
    name=i.find("a").text
    artists = i.findAll("a",class_="_link")
    artistsList = []
    for j in artists:
        artistsList.append(j.text)
    num+=1
    print("     " ,num,name,"by:", ", ".join(artistsList))
# print(url_list)
user = int(input("Enter a number for Gaana and bajana "))
song = url_list[user-1]
# print(song)
webbrowser.open_new_tab(song)

