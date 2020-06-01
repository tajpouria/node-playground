### K8S

#### Components https://kubernetes.io/docs/concepts/overview/components/

#### Installing MiniKube https://kubernetes.io/docs/setup/learning-environment/minikube/

- start and stop the cluster

  > minikube start

  > minikube stop

- cluster-info

  > kubectl cluster-info

- --help
  > kubectl create --help

#### Node

- get

  > kubectl get nodes

#### Pod

A Pod encapsulates an application’s container (or, in some cases, multiple containers), storage resources, a unique network identity (IP address), as well as options that govern how the container(s) should run

pod-definition.yml

```yml
apiVersion: "v1"
kind: "Pod"
metadata:
  name: "foo-pod"
  labels: # Any Arbitrary key value pair
    app: "foo"
    type: "front-end"
spec:
  containers:
    - name: "redis"
      image: "redis:latest"
```

- create

  > kubectl create -f pod-definition.yml

- run

  > kubectl run POD_NAME --image=POD_IMAGE

- get

  > kubectl get pods -o wide # Retrieves NODE and IP as well

- describe

  > kubectl describe pod

  > kubectl get pod foo-pod

- delete

  > kubectl delete pod redis