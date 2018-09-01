java -server
-Dmaven.test.skip=true -Djazz.connector.sslProtocol=TLSv1 -Dcom.ibm.team.repository.transport.client.protocol=TLSv1 -Dhttps.protocols=TLSv1 -Djdk.tls.client.protocols=TLSv1
-jar target/DLS.jar
