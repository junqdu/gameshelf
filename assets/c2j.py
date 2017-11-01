import csv
with open('collection.csv', 'rb') as csvfile:
    id = 1
    name = 0
    rating = 2
    average = 21
    weight = 22
    rank = 23
    minPlayer = 27
    maxPlayer = 28
    playingtime = 29
    bggrecplayers = 33
    bggbestplayers = 34
    x = '{'
    spamreader = csv.reader(csvfile, quotechar='"', delimiter=',',
                     quoting=csv.QUOTE_ALL, skipinitialspace=True)
    next(spamreader, None)
    for row in spamreader:
        x += ('"' + row[1] + '":{"name":"' + row[name]
            + '", "average":' + row[average]
            + ', "weight":' + row[weight]
            + ', "rank":' + row[rank]
            + ', "minPlayer":' + row[minPlayer]
            + ', "maxPlayer":' + row[maxPlayer]
            + ', "playingtime":' + row[playingtime]
            + ', "bggrecplayers":"' + row[bggrecplayers]
            + '", "bggbestplayers":"' + row[bggbestplayers]
            + '", "rating":' + row[rating]
            + '},')
    x += '}'

    new = list(x)
    new[len(new)-2] = ''


    file = open("game.json","w")
    file.write(''.join(new))
    file.close()
