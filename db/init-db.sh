# wait 30s
sleep 30s

# run script to create DB schema
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P $SA_PASSWORD -i createTables.sql