#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
#!/bin/bash
echo "Server type"
ec2Type=$(curl http://169.254.169.254/latest/meta-data/instance-type 2>/dev/null)
if [ $ec2Type="t2.micro" ]
then
  npm run start:staging
else
  npm run start:dev
fi
sudo service apache2 restart
echo 'Apache service started'
echo 'Site is UP'
