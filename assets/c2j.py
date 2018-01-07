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
    itemtype = 42
    x = '{'
    spamreader = csv.reader(csvfile, quotechar='"', delimiter=',',
                     quoting=csv.QUOTE_ALL, skipinitialspace=True)
    next(spamreader, None)
    for row in spamreader:
        if (row[rank] != '0') or (row[itemtype] == 'expansion' and float(row[average]) >= 6) :
            print float(row[average])
            print row[name]
            x += ('"' + row[1]
                # + '"name":"' + row[name]
                # + '", "average":' + row[average]
                + '":{ "w":' + str(round(float(row[weight]), 2))
                # + ', "rank":' + row[rank]
                # + ', "minPlayer":' + row[minPlayer]
                # + ', "maxPlayer":' + row[maxPlayer]
                # + ', "playingtime":' + row[playingtime]
                # + ', "bggrecplayers":"' + row[bggrecplayers]
                + ', "b":"' + row[bggbestplayers]
                + '", "r":"' + row[bggrecplayers]
                + '", "t":"' + row[itemtype]
                # + '", "rating":' + row[rating]
                + '"},')
    x += '}'

    new = list(x)
    new[len(new)-2] = ''


    file = open("game.json","w")
    file.write(''.join(new))
    file.close()
