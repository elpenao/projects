# The sqlite3 module is used to work with the SQLite database.
import sqlite3 as lite
import pandas as pd

input = str(raw_input("Name your city: "))

cities = ((input, 'NV'),
                    ('Atlanta', 'GA'))

weather = ((input, 2013, 'July', 'December'),
                     ('Atlanta', 2013, 'July', 'January'))


# Here you connect to the database. The `connect()` method returns a connection object.
con = lite.connect('getting_started.db')

with con:
  # From the connection, you get a cursor object. The cursor is what goes over the records that result from a query.
  cur = con.cursor()
  cur.execute("DROP TABLE IF EXISTS weather")
  cur.execute("DROP TABLE IF EXISTS cities")
  cur.execute("CREATE TABLE cities (name text, state text)")
  cur.execute("CREATE TABLE weather (city text, year integer, warm_month text, cold_month text)")
  cur.executemany("INSERT INTO cities VALUES(?,?)", cities)
  cur.executemany("INSERT INTO weather VALUES(?,?,?,?)", weather)
  cur.execute("SELECT city, state, warm_month FROM weather INNER JOIN cities on city = name")

  rows = cur.fetchall()
  cols = [desc[0] for desc in cur.description]
  df = pd.DataFrame(rows, columns=cols)

  print df['city'] + ", " + df['state'] + " is hottest in " + df['warm_month']