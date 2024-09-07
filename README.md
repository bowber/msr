# Mini Services Runner (MSR)
Environment for container-based application. Inspired by GCP Cloud Run. Available to run as a single-node or multi-node cluster for High Availability.

## This project includes 3 repositories

- [msr-ansible](https://github.com/bowber/msr-ansible): Ansible Playbook to install components needed for an MSR cluster
- msr-dashboard: Frontend for MSR users
- msr-controller: Gateway handles requests from the dashboard

## Additional repositories (not required for basic usage)

- msr-gcp-terraform: Terraform demo config for GCP Compute setup

## Networking

1. DNS wildcard subdomain to your cluster public IP
2. Domain routing in MSR cluster ingress proxy
3. Each service is routed to a separate domain by the ingress proxy

## CI/CD & Container Registry
- MSR uses GitHub Actions & GitHub Packages as default for CI/CD & Container Registry
- More external solutions will be added later
- There's no plan to add any built-in solution yet for simplicity and keep the cluster "Mini" as it's name suggested.
