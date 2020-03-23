#!/bin/bash

function find_tomcat {
	TOMCAT_HOME=$(sudo find / -regex ".*tomcat.*/bin.*" -type d)
	TOMCAT_HOME=$(dirname "$TOMCAT_HOME")
}

function tomcat_service(){
	if ( sudo "$TOMCAT_HOME/bin/$1.sh" 2>&1 ); then
		echo "TOMCAT STATUS: $1"
	fi
}

function delete_webapps {
	results=$(sudo /usr/bin/find "$TOMCAT_HOME/webapps")
	if [[ -d $TOMCAT_HOME/webapps ]]; then
		ls -A $results && sudo /bin/rm -fr "$TOMCAT_HOME/webapps/*" || ( echo "Failed deleting the webapps directory..." && exit 1)
	fi
}

function unzip_artifact {
	zipfile=$(/bin/ls -t | egrep "pack.*wars.*.zip.*" | head -1)
	if [[ ! -z $zipfile && ${zipfile+x} ]]; then
		sudo /usr/bin/unzip -qqo "$zipfile" -d "$TOMCAT_HOME/webapps"
	else
		echo "${FUNCNAME[0]} failed because the ZIP file was not found" && exit 1
	fi
}

function unpack_wars {
	results=$(sudo /usr/bin/find $TOMCAT_HOME/webapps -regex ".*.war")
	for result in $results;
	do
		warfile="$result"
		directory=$(/usr/bin/basename -s .war $result)
		if [[ ! -z $warfile && ${warfile+x} ]]; then
			sudo /usr/bin/unzip -qqo "$warfile" -d "$TOMCAT_HOME/webapps/$directory"
		else
			echo "${FUNCNAME[0]} failed because the WAR file was not found" && exit 1
		fi
	done
}

function change_ip(){
	ip=$1
	sudo /usr/bin/find "$TOMCAT_HOME/webapps/ROOT" -type f -iname services.properties -exec sed -i "s/url.host=.*/url.host=$ip/g" {} \;
}

function change_port(){
	port=$1
	sudo /usr/bin/find "$TOMCAT_HOME/webapps" -type f -iname services.properties -exec sed -i "s/url.port=.*/url.port=$port/g" {} \;
}

function db_create_user {
	psql -U postgres -d postgres -E -S -w -c "CREATE USER demoapp WITH SUPERUSER;"
}

function db_create_db {
	createdb -h localhost -U demoapp -w -e "adv_account" -O demoapp
	createdb -h localhost -U demoapp -w -e "adv_catalog" -O demoapp
	createdb -h localhost -U demoapp -w -e "adv_order" -O demoapp
}

function db_run_scripts {
	psql -U demoapp -d adv_account -w -a -f ./creproc--adv-account--get_all_countries_with_sleep\(p_sleep_for\ int\).sql
	psql -U demoapp -d adv_account -w -a -f ./creproc--adv-catalog--truncate_catalog_tables\(\).sql
	psql -U demoapp -d adv_catalog -w -a -f ./creproc--adv-catalog--truncate_catalog_tables\(\).sql
}

function db_change_status {
	sudo find "$TOMCAT_HOME/webapps" -type f -iname internal_config_for_env.properties -exec sed -i 's/account.hibernate.db.hbm2ddlAuto=.*/account.hibernate.db.hbm2ddlAuto=create/g' {} \;
	sudo find "$TOMCAT_HOME/webapps" -type f -iname internal_config_for_env.properties -exec sed -i 's/catalog.hibernate.db.hbm2ddlAuto=.*/catalog.hibernate.db.hbm2ddlAuto=create/g' {} \;
	sudo find "$TOMCAT_HOME/webapps" -type f -iname internal_config_for_env.properties -exec sed -i 's/order.hibernate.db.hbm2ddlAuto=.*/order.hibernate.db.hbm2ddlAuto=create/g' {} \;
}

find_tomcat
tomcat_service 'shutdown'
delete_webapps
unzip_artifact
unpack_wars
change_ip '52.91.163.62'
change_port '8080'
tomcat_service 'startup'
