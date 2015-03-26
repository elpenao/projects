import sqlite3 as lite
import pandas as pd

con = lite.connect('getting_started.db')

# Select all rows and print the result set one row at a time
with con:

  cur = con.cursor()
  cur.execute("SELECT * FROM cities")


  rows = cur.fetchall()
  cols = [desc[0] for desc in cur.description]
  df = pd.DataFrame(rows, columns=cols)