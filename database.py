# The sqlite3 module is used to work with the SQLite database.
import sqlite3 as lite

cities = (('Las Vegas', 'NV'),
                    ('Atlanta', 'GA'))

weather = (('Las Vegas', 2013, 'July', 'December'),
                     ('Atlanta', 2013, 'July', 'January'))


# Here you connect to the database. The `connect()` method returns a connection object.
con = lite.connect('getting_started.db')

with con:
  # From the connection, you get a cursor object. The cursor is what goes over the records that result from a query.
  cur = con.cursor()
  cur.execute("DROP TABLE IF EXISTS weather")
  cur.execute("DROP TABLE IF EXISTS cities")
  cur.executemany("INSERT INTO cities VALUES(?,?)", cities)
  cur.executemany("INSERT INTO weather VALUES(?,?,?,?)", weather)