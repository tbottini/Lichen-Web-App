
docker buildx build --platform=linux/amd64 -t 938875074697.dkr.ecr.eu-west-3.amazonaws.com/lichen-web .

docker login --username AWS --password $(aws ecr get-login-password) 938875074697.dkr.ecr.eu-west-3.amazonaws.com/lichen-web

docker push 938875074697.dkr.ecr.eu-west-3.amazonaws.com/lichen-web

mssh i-0036004d283e60d17 << 'ENDSSH'
echo $HOME

docker login --username AWS --password $(aws ecr get-login-password) 938875074697.dkr.ecr.eu-west-3.amazonaws.com/lichen-web

docker pull 938875074697.dkr.ecr.eu-west-3.amazonaws.com/lichen-web:latest

docker-compose up -d

ENDSSH
