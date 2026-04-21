FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# 🔥 Go directly into project folder
WORKDIR /app/RealEstateAPI

COPY RealEstateAPI/. .

RUN dotnet restore
RUN dotnet publish -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app

COPY --from=build /app/out .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "RealEstateAPI.dll"]
