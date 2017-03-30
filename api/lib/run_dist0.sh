echo "Running the dist"

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

echo "input file Arg1 $1"
echo "output directory Arg2 $2"
MEASURE=$3
echo "From the measure variable: $MEASURE"

echo "Fixing permission on pem file"
chmod 0400 api/lib/mAdviser_key_pair.pem

# SAMPLE SCRIPT
#ssh -i api/lib/mAdviser_key_pair.pem hadoop@ec2-54-88-153-37.compute-1.amazonaws.com spark-submit --master yarn  --deploy-mode client /home/hadoop/codebase/marlabs-bi/bi/scripts/descr_stats.py "hdfs://localhost:9000/user/input/Iris.csv" "hdfs://localhost:9000/user/output/output_prakash.json" --driver-memory 1g --executor-memory 1g --executor-cores 2


# DO NOT FORGET TO UNCOMMENT THIS!!!!
echo "Running for descr_stats"
spark-submit --master yarn  --deploy-mode client /home/ankush/codebase/marlabs-bi/bi/scripts/descr_stats.py --input "hdfs://localhost:9000/$1" --result "hdfs://localhost:9000$2/result.json" --narratives "hdfs://localhost:9000$2/narratives.json" --measurecolumn $MEASURE

echo "Running for one_way_anova.py"
spark-submit --master yarn  --deploy-mode client /home/ankush/codebase/marlabs-bi/bi/scripts/one_way_anova.py --input "hdfs://localhost:9000/$1" --result "hdfs://localhost:9000$2/dimensions-result.json" --narratives "hdfs://localhost:9000$2/dimensions-narratives.json" --measurecolumn $MEASURE

echo "Running regression py"
spark-submit --master yarn  --deploy-mode client /home/ankush/codebase/marlabs-bi/bi/scripts/regression.py --input "hdfs://localhost:9000/$1" --result "hdfs://localhost:9000$2/reg-result.json" --narratives "hdfs://localhost:9000$2/reg-narratives.json" --measurecolumn $MEASURE
