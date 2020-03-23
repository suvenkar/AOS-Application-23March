namespace=devops-r5-dev mastercreditPort=30003 orderPort=30002 safepayPort=30005 shipexPort=30004 accountServicePort=30006 frontPort=30001 sed -r 's/^(.*)(\$\{[a-zA-Z_]+\})/echo "\1\2"/e' adm-infru-services.yaml | sudo kubectl --kubeconfig admin.conf apply -f -

namespace=devops-r5-sit mastercreditPort=30013 orderPort=30012 safepayPort=30015 shipexPort=30014 accountServicePort=30016 frontPort=30011 sed -r 's/^(.*)(\$\{[a-zA-Z_]+\})/echo "\1\2"/e' adm-infru-services.yaml | sudo kubectl --kubeconfig admin.conf apply -f -
 
namespace=devops-r5-qas mastercreditPort=30023 orderPort=30022 safepayPort=30025 shipexPort=30024 accountServicePort=30026 frontPort=30021 sed -r 's/^(.*)(\$\{[a-zA-Z_]+\})/echo "\1\2"/e' adm-infru-services.yaml | sudo kubectl --kubeconfig admin.conf apply -f -

namespace=devops-r5-stg mastercreditPort=30033 orderPort=30032 safepayPort=30035 shipexPort=30034 accountServicePort=30036 frontPort=30031 sed -r 's/^(.*)(\$\{[a-zA-Z_]+\})/echo "\1\2"/e' adm-infru-services.yaml | sudo kubectl --kubeconfig admin.conf apply -f -
 
namespace=devops-r5-prd mastercreditPort=30043 orderPort=30042 safepayPort=30045 shipexPort=30044 accountServicePort=30046 frontPort=30041 sed -r 's/^(.*)(\$\{[a-zA-Z_]+\})/echo "\1\2"/e' adm-infru-services.yaml | sudo kubectl --kubeconfig admin.conf apply -f -
