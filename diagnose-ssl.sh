#!/bin/bash
# Run these commands on your VPS to diagnose the issue

echo "=== Checking Ingress Resources ==="
kubectl get ingress -n plandera-webpage-staging
kubectl get ingress -n plandera-webpage-production

echo -e "\n=== Checking Certificates ==="
kubectl get certificate -n plandera-webpage-staging
kubectl get certificate -n plandera-webpage-production

echo -e "\n=== Checking Certificate Details (Staging) ==="
kubectl describe certificate -n plandera-webpage-staging

echo -e "\n=== Checking Certificate Details (Production) ==="
kubectl describe certificate -n plandera-webpage-production

echo -e "\n=== Checking cert-manager pods ==="
kubectl get pods -n cert-manager

echo -e "\n=== Checking Services ==="
kubectl get svc -n plandera-webpage-staging
kubectl get svc -n plandera-webpage-production

echo -e "\n=== Checking Pods ==="
kubectl get pods -n plandera-webpage-staging
kubectl get pods -n plandera-webpage-production

echo -e "\n=== To manually trigger certificate issuance ==="
echo "kubectl delete certificate staging-webpage-tls -n plandera-webpage-staging"
echo "kubectl delete certificate production-webpage-tls -n plandera-webpage-production"

