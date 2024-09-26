# Mini Services Runner (MSR)
Environment for container-based application. Inspired by GCP Cloud Run. Available to run as a single-node or multi-node cluster for High Availability.  
This project includes a single app that provides tools to help quickly set up, manage, and maintain an MSR Cluster alongside the services.

## This project is based on these primary components
- `k0s`: Compact edition of Kubernetes
- `k0sctl`: Setup & maintain k0s cluster
- `kube-rs`: k8s driver for Rust
- `keda`: Autoscale services to zero instances

## Networking
1. DNS wildcard subdomain to your cluster public IP
2. Domain routing in MSR cluster Ingress Controller
3. Each service is routed to a separate domain by the Ingress Controller

## CI/CD & Container Registry
- MSR uses GitHub Actions & GitHub Packages as default for CI/CD & Container Registry
- Will use Gitea as an internal solution for **lower networking cost** and **Github compatibility** (which will use more hardware resources as a trade-off, especially Disk I/O)
- More external solutions will be added later

