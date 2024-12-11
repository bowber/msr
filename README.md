# Mini Services Runner (MSR)

Tools to setup environment for container-based application. Inspired by GCP Cloud Run. Available to run as a single-node or multi-node cluster for High Availability.  
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

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Development

1. Clone this repository
2. Install dependencies: `yarn install`
3. Open 2 terminals
4. In terminal 1, run `yarn dev` to start the frontend
5. In terminal 2, change directory to `src-tauri` and run `cargo run` to start the backend
6. Restart the backend when you make changes to the backend code, the frontend is hot-reloaded by default

> Why not use `yarn tauri dev`? Because it will cause the auto `cargo check` of rust-analyzer to run very slow, which is not recommended for development.

> Make sure you have Tauri Pre-requisites installed: https://v2.tauri.app/start/prerequisites/
